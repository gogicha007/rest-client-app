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
import { IoIosCloseCircleOutline } from 'react-icons/io';
import s from './Variables.module.scss';

export const Variables = () => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const variables = useSelector(
    (state: RootState) => state.variables.variables
  );
  const dispatch = useAppDispatch();

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
    <article className={s.variables}>
      <section className={s.variables__section}>
        <div className={s.variables__container}>
          <h3>Add Variable</h3>
          <div className={s.variables__inputContainer}>
            <input
              type="text"
              placeholder="Key..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <input
              type="text"
              placeholder="Data..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button className="button" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>
        <div>
          <h3>Current Variables</h3>
          <div>
            {variables.map((variable) => (
              <div key={variable.key} className={s.variables__item}>
                <button
                  className={s.variables__close}
                  onClick={() => handleRemove(variable.key)}
                >
                  <IoIosCloseCircleOutline className="text-2xl" />
                </button>
                <span>
                  {variable.key}: {variable.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
};
