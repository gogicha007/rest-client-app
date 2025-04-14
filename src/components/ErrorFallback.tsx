'use client';
import { useRouter } from 'next/navigation';
import { handleError } from '@/utils/errorHandler';
import { useTranslations } from 'next-intl';

type ErrorFallbackProps = {
  error: Error & { digest?: string };
  reset?: () => void;
  header: string;
};

export default function ErrorFallback({
  error,
  reset,
  header,
}: ErrorFallbackProps) {
  const tBtn = useTranslations('Buttons') || ((key: string) => key);
  const router = useRouter();

  const handleResetOrRedirect = () => {
    if (reset) {
      reset();
    } else {
      router.push('/');
    }
  };

  return (
    <div>
      <h2>{header}</h2>
      <h3>{handleError(error).message || 'An unexpectged error occurred.'}</h3>
      <button className="button" onClick={handleResetOrRedirect}>
        {typeof reset === 'function' ? tBtn('tryAgain') : tBtn('toMain')}
      </button>
    </div>
  );
}
