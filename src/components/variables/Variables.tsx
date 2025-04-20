'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import {
  loadVariablesFromLocalStorage,
  saveVariableToLocalStorage,
  removeVariableFromLocalStorage,
} from '@/store//variablesThunks';
import { useTranslations } from 'next-intl';
import { BsTrash3Fill } from 'react-icons/bs';
import s from './Variables.module.scss';

export const Variables = () => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const variables = useSelector(
    (state: RootState) => state.variables.variables
  );
  const dispatch = useAppDispatch();

  const tHist = useTranslations('VariablesPage');
  useEffect(() => {
    dispatch(loadVariablesFromLocalStorage());
  }, [dispatch]);

  const handleAdd = () => {
    if (key && value) {
      dispatch(saveVariableToLocalStorage({ key, value }));
      setKey('');
      setValue('');
    }
  };

  const handleRemove = (keyToRemove: string) => {
    dispatch(removeVariableFromLocalStorage(keyToRemove));
  };

  return (
    <div className="container">
      <h1 className="title">{tHist('title')}</h1>
      <article className={s.variables}>
        <section className={s.variables__section}>
          <div className={s.variables__container}>
            <h3>{tHist('add_variable')}</h3>
            <div className={s.variables__inputContainer}>
              <input
                type="text"
                placeholder={`${tHist('key')}...`}
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <input
                type="text"
                placeholder={`${tHist('value')}...`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <button
                className="button"
                disabled={!key || !value}
                onClick={handleAdd}
              >
                {tHist('button')}
              </button>
            </div>
          </div>
          <div>
            <h3>{tHist('current_variables')}</h3>
            <div>
              <table className={s.variables__table}>
                <thead>
                  <tr>
                    <th className={s.variables__headerCell}></th>
                    <th className={s.variables__headerCell}>{tHist('key')}</th>
                    <th className={s.variables__headerCell}>
                      {tHist('value')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {variables.map((variable) => (
                    <tr key={variable.key}>
                      <td
                        className={`${s.variables__tableClose} ${s.variables__bodyCell} `}
                      >
                        <button
                          className={s.variables__close}
                          onClick={() => handleRemove(variable.key)}
                        >
                          <BsTrash3Fill className="text-1xl" />
                        </button>
                      </td>
                      <td className={s.variables__bodyCell}>{variable.key}</td>
                      <td className={s.variables__bodyCell}>
                        {variable.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};

export default Variables;
