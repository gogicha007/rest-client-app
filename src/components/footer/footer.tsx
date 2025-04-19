import styles from './footer.module.scss';
import RssLogo from '../../../public/rss.svg';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegCopyright } from 'react-icons/fa';

const userData = [
  {
    initials: 'IG',
    name: 'Irakli Gogicha',
    github: 'https://github.com/gogicha007',
  },
  {
    initials: 'OP',
    name: 'Oleg Polovinko',
    github: 'https://github.com/sheritsh',
  },
  {
    initials: 'VB',
    name: 'Vladyslav Barvinko',
    github: 'https://github.com/Barvinko',
  },
];

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
      <div className={styles.footer__userLinks}>
        {userData.map((user, index) => (
          <Link
            key={index}
            href={user.github}
            className={styles.footer__userLink}
            target="_blank"
          >
            <span className="font-[600]">{user.initials}</span>
            <span className={styles.footer__fullname}>{user.name}</span>
          </Link>
        ))}
      </div>
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
