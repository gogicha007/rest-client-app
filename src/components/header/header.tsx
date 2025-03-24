'use client';
import styles from './header.module.css';
import LocaleSwitcher from '../locale-switcher/LocaleSwitcher';
import Logo from '../../../public/logo.svg';
import { signOut } from 'firebase/auth';


const Header = () => {

  return (
    <div className={styles.header}>
      <Logo className={styles.logo}/>
      <LocaleSwitcher />
      <button className={styles.button} onClick={()=> signOut}>Sign Out</button>
    </div>
  );
};

export default Header;
