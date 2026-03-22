'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewSession() {
  const router = useRouter();

  useEffect(() => {
    async function create() {
      try {
        const res = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        if (res.ok) {
          const session = await res.json();
          router.replace(`/session/${session.id}`);
        } else {
          router.replace('/');
        }
      } catch {
        router.replace('/');
      }
    }
    create();
  }, [router]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-text-muted">Creating new session...</div>
    </div>
  );
}
