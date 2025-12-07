import { useState, useEffect } from 'react';
import { generateFingerprint } from '@/lib/fingerprint';

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getFingerprint = async () => {
      try {
        const fp = await generateFingerprint();
        setFingerprint(fp);
      } catch (error) {
        // Fallback to random string if fingerprint fails
        setFingerprint(Math.random().toString(36).substring(2, 15));
      } finally {
        setIsLoading(false);
      }
    };

    getFingerprint();
  }, []);

  return { fingerprint, isLoading };
}
