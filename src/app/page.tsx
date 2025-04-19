'use client';
import styles from './page.module.scss';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/auth';
import Link from 'next/link';
import About from '@/components/about/about';

export default function Home() {
  const { currentUser } = useAuth() || { currentUser: null };
  const tH = useTranslations('HomePage') || ((key: string) => key);
  const tA = useTranslations('AuthForm') || ((key: string) => key);

  const WelcomeMessage = () => (
    <div className={styles.home__welcome}>
      <About />
      {currentUser
        ? `${tH('welcomeBack')} ${currentUser.email}`
        : tH('welcome')}
      {!currentUser && (
        <div className={styles.home__auth}>
          <Link href="/sign-in">{tA('login')}</Link>
          <Link href="/sign-up">{tA('register')}</Link>
        </div>
      )}
    </div>
  );

  const MenuLinks = () => (
    <div className={styles.home__menu}>
      <Link href="/rest-client/get">{tH('restClient')}</Link>
      <Link href="/history">{tH('history')}</Link>
      <Link href="/variables">{tH('variables')}</Link>
    </div>
  );

  return (
    <div className={styles.home}>
      <WelcomeMessage />
      {currentUser && <MenuLinks />}
    </div>
  );
}
