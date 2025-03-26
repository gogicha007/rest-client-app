'use client';
import styles from './page.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase/config';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  console.log({ user });

  const t = useTranslations('HomePage');
  console.log(t('title'));

  if (!user) {
    router.push('/sign-in');
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>{t('title')}</main>
    </div>
  );
}
