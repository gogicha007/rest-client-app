import styles from './footer.module.scss';
import RssLogo from '../../../public/rss.svg';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegCopyright } from 'react-icons/fa';
import { developersData } from '@/types/developersData';

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
        <h2 className="text-zinc-400 flex justify-center items-center gap-[0.2rem]">
          2025 <FaRegCopyright />
        </h2>
      </Link>
      <div className={styles.footer__developerLinks}>
        {developersData.map((developer, index) => (
          <Link
            key={index}
            href={developer.github}
            className={styles.footer__developerLink}
            target="_blank"
          >
            <span className="font-[600]">{developer.initials}</span>
            <span className={styles.footer__fullname}>{developer.name}</span>
          </Link>
        ))}
      </div>
      {isProduction ? (
        <Image
          src={logoSrc}
          alt="RssLogo"
          className={`${styles.footer__logo} ${styles.prod}`}
          priority
        />
      ) : (
        <RssLogo className={`${styles.footer__logo} ${styles.dev}`} />
      )}
    </div>
  );
};

export default Footer;
