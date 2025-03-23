import styles from './langToggle.module.css';
import React from 'react';

const LangToggle = () => {
  return (
    <center>
      <div className={styles.switch}>
        <input
          id="language-toggle"
          className={
            styles['check-toggle'] + ' ' + styles['check-toggle-round-flat']
          }
          type="checkbox"
        />
        <label htmlFor="toggle"></label>
        <span className={styles.on}>EN</span>
        <span className={styles.off}>DE</span>
      </div>
    </center>
  );
};

export default LangToggle;
