'use client';
import { Variables } from '@/components/variables/Variables';
import styles from './page.module.scss';

const VariablesPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Variables</h1>
      <Variables />
    </div>
  );
};

export default VariablesPage;
