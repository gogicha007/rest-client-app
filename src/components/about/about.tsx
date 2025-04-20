import styles from './about.module.css';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { developersData } from '@/types/developersData';

const About = () => {
  const tAb = useTranslations('HomePage');
  return (
    <details className={styles.about}>
      <summary className={styles.about__title}>{tAb('about.title')}</summary>
      <p className={styles.about__header}>{tAb('about.authors')}</p>
      <div className={styles.about__authors}>
        {developersData.map((developer, index) => (
          <Link key={index} href={developer.github} target="_blank">
            {developer.name}
          </Link>
        ))}
      </div>
      <p className={styles.about__header}>{tAb('about.project_header')}</p>
      <p>{tAb('about.project_content')}</p>
      <p className={styles.about__header}>{tAb('about.course_header')}</p>
      <p>{tAb('about.course_content')}</p>
    </details>
  );
};

export default About;
