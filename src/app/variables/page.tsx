'use client';
import { useRouter } from 'next/navigation';

const Variables = () => {
  const router = useRouter();
  return (
    <>
      <div>Variables</div>
      <button onClick={() => router.push('/')}>back to main</button>
    </>
  );
};

export default Variables;
