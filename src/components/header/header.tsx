'use client';
import styles from './header.module.scss';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '../locale-switcher/LocaleSwitcher';
import AuthBar from '../auth-bar/authBar';
import Logo from '../../../public/logo.svg';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const logoSrc = isProduction ? '/logo.svg' : Logo;
  const tHeader = useTranslations('HeaderMenu');

  return (
    <div className={styles.header}>
      {isProduction ? (
        <Image src={logoSrc} alt="Logo" className={styles.logo} priority />
      ) : (
        <Logo className={styles.logo} />
      )}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>
          {tHeader('home')}
        </Link>
        <Link href="/rest-client/get" className={styles.navLink}>
          {tHeader('rest-client')}
        </Link>
        <Link href="/history" className={styles.navLink}>
          {tHeader('history')}
        </Link>
        <Link href="/variables" className={styles.navLink}>
          {tHeader('variables')}
        </Link>
      </nav>
      <LocaleSwitcher />
      <AuthBar />
    </div>
  );
};

export default Header;
