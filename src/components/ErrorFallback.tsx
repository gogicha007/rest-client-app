import { useEffect } from 'react';
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
  useEffect(() => {
    const categorizedError = handleError(error);
    console.error(categorizedError.message);
  }, [error]);

  const tBtn = useTranslations('Buttons');
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
      <h3>{handleError(error).message}</h3>
      <button className="button" onClick={handleResetOrRedirect}>
        {reset === undefined ? tBtn('toMain') : tBtn('tryAgain')}
      </button>
    </div>
  );
}
