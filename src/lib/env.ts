// Environment validation - runs at startup to ensure all required vars exist

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Check your .env.local file.`);
  }
  return value;
}

export function validateEnv() {
  return {
    GEMINI_API_KEY: requireEnv('GEMINI_API_KEY'),
    DATABASE_URL: requireEnv('DATABASE_URL'),
    NEXTAUTH_SECRET: requireEnv('NEXTAUTH_SECRET'),
  };
}

export function getGeminiKey(): string {
  return requireEnv('GEMINI_API_KEY');
}
