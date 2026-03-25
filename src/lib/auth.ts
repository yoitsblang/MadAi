import NextAuth from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

const ADMIN_EMAIL = 'bslang97@gmail.com';

const providers: Provider[] = [
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
      });

      if (!user || !user.hashedPassword) return null;

      const isValid = await bcrypt.compare(
        credentials.password as string,
        user.hashedPassword
      );

      if (!isValid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

// Only add Google provider if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // No adapter — we handle user/account creation manually in signIn callback
  // This avoids PrismaAdapter compatibility issues with NextAuth v5 beta OIDC flow
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        try {
          // Find or create user from Google profile
          let dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          const isAdmin = profile.email === ADMIN_EMAIL;
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || profile.email.split('@')[0],
                image: (profile as Record<string, unknown>).picture as string || null,
                emailVerified: new Date(),
                role: isAdmin ? 'admin' : 'user',
                credits: isAdmin ? 999999 : 50,
              },
            });
          } else {
            // Update profile info from Google + ensure admin role
            const updateData: Record<string, unknown> = {
              name: dbUser.name || profile.name,
              image: dbUser.image || (profile as Record<string, unknown>).picture as string || null,
              emailVerified: dbUser.emailVerified || new Date(),
            };
            if (isAdmin && dbUser.role !== 'admin') {
              updateData.role = 'admin';
              updateData.credits = 999999;
            }
            await prisma.user.update({ where: { id: dbUser.id }, data: updateData });
          }

          // Upsert the Account link
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: 'google',
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }

          // Set the user id so JWT callback can use it
          user.id = dbUser.id;
          return true;
        } catch (error) {
          console.error('[AUTH] Google signIn error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.provider = account.provider;
      }
      // For Google users, ensure we have the DB user id
      if (account?.provider === 'google' && !token.id && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, subscriptionTier: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.tier = dbUser.subscriptionTier;
        }
      }
      // Load role/tier from DB on every token refresh for freshness
      if (token.id && (!token.role || !token.tier)) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, subscriptionTier: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.tier = dbUser.subscriptionTier;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        (session.user as Record<string, unknown>).role = token.role || 'user';
        (session.user as Record<string, unknown>).tier = token.tier || 'free';
      }
      return session;
    },
  },
});
