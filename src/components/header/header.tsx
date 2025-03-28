"use client"
import styles from './header.module.scss';
import LocaleSwitcher from '../locale-switcher/LocaleSwitcher';
import Logo from '../../../public/logo.svg';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';

const Header = () => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('signed out');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className={styles.header}>
      <Logo className={styles.logo}/>
      <LocaleSwitcher />
      <button className={styles.button} onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
};

export default Header;
