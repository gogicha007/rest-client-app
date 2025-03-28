'use client';
import styles from './page.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const t = useTranslations('HomePage');

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>{t('title')}</main>
    </div>
  );
}
