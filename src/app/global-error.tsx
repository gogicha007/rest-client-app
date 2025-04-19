'use client';
import ErrorFallback from '@/components/ErrorFallback';
import { useTranslations } from 'next-intl';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('HomePage');
  return <ErrorFallback error={error} reset={reset} header={t('pageError')} />;
}
