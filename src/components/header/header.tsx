import styles from './header.module.scss';
import LocaleSwitcher from '../locale-switcher/LocaleSwitcher';
import Logo from '../../../public/logo.svg';

const Header = () => {
  return (
    <div className={styles.header}>
      <Logo className={styles.logo} />
      <LocaleSwitcher />
    </div>
  );
};

export default Header;
