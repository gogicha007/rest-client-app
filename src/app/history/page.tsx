'use client';
import { useRouter } from 'next/navigation';

const History = () => {
  const router = useRouter();
  return (
    <>
      <div>History</div>
      <button onClick={() => router.push('/')}>back to main</button>
    </>
  );
};

export default History;
