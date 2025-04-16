import styles from './footer.module.scss';
import RssLogo from '../../../public/rss.svg';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const logoSrc = isProduction ? '/rss.svg' : RssLogo;
  return (
    <div className={styles.footer}>
      <Link
        href="https://github.com/gogicha007/rest-client-app"
        className={styles.footer__link}
        target="_blank"
      >
        QueryMasters
      </Link>
      <h2>2025</h2>
      {isProduction ? (
        <Image
          src={logoSrc}
          alt="RssLogo"
          className={styles.footer__logo}
          priority
        />
      ) : (
        <RssLogo className={styles.footer__logo} />
      )}
    </div>
  );
};

export default Footer;
