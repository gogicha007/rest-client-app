'use client';
import React from 'react';
import styles from './header.module.scss';
import LocaleSwitcher from '../locale-switcher/LocaleSwitcher';
import Logo from '../../../public/logo.svg';
import AuthBar from '../auth-bar/authBar';
import Link from 'next/link';

const Header = () => {
  return (
    <div className={styles.header}>
      <Logo className={styles.logo} />
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
