import styles from './about.module.css';
import Link from 'next/link';

const About = () => {
  return (
    <details className={styles.about}>
      <summary className={styles.about__title}>About the project</summary>
      <p className={styles.about__header}>Developers</p>
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
      <p className={styles.about__header}>Project</p>
      <p>REST Client app - A light-weight version of Postman created with Next JS</p>
      <p className={styles.about__header}>Course</p>
      <p>RS School React JS</p>
      <ul>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </details>
  );
};

export default About;
