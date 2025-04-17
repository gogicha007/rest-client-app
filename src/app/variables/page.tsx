'use client';
import { Variables } from '@/components/variables/Variables';
import { useTranslations } from 'use-intl';
import styles from './page.module.scss';

const VariablesPage = () => {
  const tHist = useTranslations('VariablesPage');
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{tHist('title')}</h1>
      <Variables />
    </div>
  );
};

export default VariablesPage;
