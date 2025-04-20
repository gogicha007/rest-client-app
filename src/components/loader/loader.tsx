import styles from './loader.module.scss';

const Loader = () => {
  return (
    <div className={styles.modal}>
      <div className={styles.loader} data-testid="loader"></div>
    </div>
  );
};

export default Loader;
