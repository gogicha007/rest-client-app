'use client';
import styles from './header.module.scss';
import LocaleSwitcher from '../locale-switcher/LocaleSwitcher';
import Logo from '../../../public/logo.svg';
import AuthBar from '../auth-bar/authBar';

const Header = () => {
  return (
    <div className={styles.header}>
      <Logo className={styles.logo} />
      <LocaleSwitcher />
      <AuthBar />
    </div>
  );
};

export default Header;
