'use client';
import ErrorFallback from '@/components/ErrorFallback';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('LoginPage');
  return <ErrorFallback error={error} reset={reset} header={t('pageError')} />;
}
