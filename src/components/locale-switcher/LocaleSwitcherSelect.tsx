'use client';

import styles from './locale-switcher.module.css';
import { useTransition, useState } from 'react';
import { Locale } from '@/i18n/config';
import { setUserLocale } from '../../services/locale';
import Loader from '../loader/loader';

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label?: string;
};

export default function LocaleSwitcherSelect({ defaultValue, items }: Props) {
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useState(defaultValue === 'en' ? false : true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (onChange) {
      onChange(event.target.checked ? 'de' : 'en');
    }
  };
  function onChange(value: string) {
    const locale = value as Locale;
    console.log(value);
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <center>
      <div className={styles.switch}>
        <input
          id="language-toggle"
          className={`${styles.checkToggle} ${styles.checkToggleRoundFlat}`}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
        />
        <label htmlFor="language-toggle"></label>
        <span className={styles.on}>{items[0].value}</span>
        <span className={styles.off}>{items[1].value}</span>
      </div>
      {isPending ? <Loader /> : null}
    </center>
  );
}
