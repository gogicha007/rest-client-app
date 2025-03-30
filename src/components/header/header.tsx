import styles from './header.module.scss';
import LocaleSwitcher from '../locale-switcher/LocaleSwitcher';
import Logo from '../../../public/logo.svg';
import Link from 'next/link';

const Header = () => {
  return (
    <div className={styles.header}>
      <Logo className={styles.logo} />
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/rest-client" className={styles.navLink}>
          REST Client
        </Link>
      </nav>
      <LocaleSwitcher />
    </div>
  );
};

export default Header;
