'use client';
import styles from './header.module.scss';
import LocaleSwitcher from '../locale-switcher/LocaleSwitcher';
import AuthBar from '../auth-bar/authBar';
import Logo from '../../../public/logo.svg';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const logoSrc = isProduction ? '/logo.svg' : Logo;

  return (
    <div className={styles.header}>
      {isProduction ? (
        <Image src={logoSrc} alt="Logo" className={styles.logo} priority />
      ) : (
        <Logo className={styles.logo} />
      )}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/rest-client/get" className={styles.navLink}>
          REST Client
        </Link>
        <Link href="/variables" className={styles.navLink}>
          Variables
        </Link>
      </nav>
      <LocaleSwitcher />
      <AuthBar />
    </div>
  );
};

export default Header;
