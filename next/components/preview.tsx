'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const Preview = () => {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = async (message: MessageEvent<any>) => {
      const { origin, data } = message;

      if (origin !== process.env.NEXT_PUBLIC_API_URL) {
        return;
      }

      if (data.type === 'strapiUpdate') {
        router.refresh();
      }
    };

    // Add the event listener
    window.addEventListener('message', handleMessage);

    // Remove the event listener on unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  return null;
};
