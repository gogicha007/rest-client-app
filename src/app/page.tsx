'use client';
import styles from './page.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebaseConfig';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const [user] = useAuthState(auth);
  const tH = useTranslations('HomePage');
  const tA = useTranslations('AuthForm');

  return (
    <div className={styles.home}>
      <div className={styles.home__welcome}>
        {tH('welcome')}
        {!user && (
          <div className={styles.home__auth}>
            <Link href="/sign-in">{tA('login')}</Link>
            <Link href="/sign-up">{tA('register')}</Link>
          </div>
        )}
      </div>
      <div className={styles.home__menu}>HOME PAGE MENU ITEMS</div>
    </div>
  );
}
