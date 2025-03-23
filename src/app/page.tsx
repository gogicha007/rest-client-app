import { getTranslations } from 'next-intl/server';
import styles from './page.module.css';

export default async function Home() {
  const t = await getTranslations('HomePage');
  console.log(t('title'));
  return (
    <div className={styles.page}>
      <main className={styles.main}>{t('title')}</main>
    </div>
  );
}
