'use client';
import styles from './page.module.scss';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/auth';
import Link from 'next/link';

export default function Home() {
  const { currentUser } = useAuth();
  const tH = useTranslations('HomePage');
  const tA = useTranslations('AuthForm');

  return (
    <div className={styles.home}>
      <div className={styles.home__welcome}>
        {currentUser && `${tH('welcomeBack')} ${currentUser.email}`}
        {!currentUser && tH('welcome')}
        {!currentUser && (
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
