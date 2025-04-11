'use client';
import ErrorFallback from '@/components/ErrorFallback';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const tHist = useTranslations('HistoryPage');
  return (
    <ErrorFallback
      error={error}
      reset={undefined}
      header={tHist('pageError')}
    />
  );
}
