'use client';
import styles from './auth-form.module.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { register as firebaseRegister, login } from '@/utils/firebaseConfig';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { schema, FormFields } from './validation';
import Loader from '../loader/loader';
import { UserCredential } from 'firebase/auth';
import { useTranslations } from 'next-intl';

interface AuthFormProps {
  authType: string;
  authFunction?: (email: string, password: string) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ authType }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = useTranslations('AuthForm');
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const router = useRouter();

  const handleAuth = async (
    authFunction: (
      email: string,
      password: string
    ) => Promise<void | UserCredential>,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      await authFunction(email, password);
      setError(null);
      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`${t('error')}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { email, password } = data;
    if (authType === 'register') {
      await handleAuth(firebaseRegister, email, password);
    } else if (authType === 'login') {
      await handleAuth(login, email, password);
    }
  };

  return (
    <div className={styles.auth}>
      <h1>{t(authType)}</h1>
      <form className={styles.auth__form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.auth__item}>
          <label htmlFor="email" className={styles.auth__label}>
            {t('email')}
            <input
              {...register('email')}
              id="email"
              type="email"
              className={styles.auth__input}
              autoComplete="email"
            />
          </label>
          <p className={styles.auth__error}>{errors?.email?.message}</p>
        </div>
        <div className={styles.auth__item}>
          <label htmlFor="password" className={styles.auth__label}>
            {t('password')}
            <input
              {...register('password')}
              id="password"
              type="password"
              className={styles.auth__input}
              autoComplete="current-password"
            />
          </label>
          <p className={styles.auth__error + ' ' + styles.password}>
            {errors?.password?.message}
          </p>
        </div>
        <button className="button" type="submit" disabled={!isValid}>
          {t(authType)}
        </button>
      </form>
      {error && (
        <h2 className={styles['auth__credentials-error']}>
          {`Error: ${error.split('Error')[1]?.replace(/[()]/g, '')}`}
        </h2>
      )}
      {loading && <Loader />}
    </div>
  );
};

export default AuthForm;
