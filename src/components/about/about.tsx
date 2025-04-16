import styles from './about.module.css';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const About = () => {
  const tAb = useTranslations('HomePage');
  return (
    <details className={styles.about}>
      <summary className={styles.about__title}>{tAb('about.title')}</summary>
      <p className={styles.about__header}>{tAb('about.authors')}</p>
      <div className={styles.about__authors}>
        <Link href={'https://github.com/gogicha007'} target="_blank">
          Irakli Gogicha
        </Link>
        <Link href={'https://github.com/sheritsh'} target="_blank">
          Oleg Polovinko
        </Link>
        <Link href={'https://github.com/Barvinko'} target="_blank">
          Vlad Barvinko
        </Link>
      </div>
      <p className={styles.about__header}>{tAb('about.project_header')}</p>
      <p>{tAb('about.project_content')}</p>
      <p className={styles.about__header}>{tAb('about.course_header')}</p>
      <p>{tAb('about.course_content')}</p>
    </details>
  );
};

export default About;
