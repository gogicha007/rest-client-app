'use client';
import styles from './auth-form.module.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { register as firebaseRegister, login } from '../../lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters' })
    .regex(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/,
      {
        message:
          'Password to contain: 1 number, 1 uppercased letter, 1 lowercased letter, 1 special character',
      }
    ),
});

type FormFields = z.infer<typeof schema>;

interface AuthFormProps {
  authType: string;
  authFunction?: (email: string, password: string) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ authType }) => {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const router = useRouter();

  useEffect(() => {
    if (error) {
      throw new Error(error);
    }
  }, [error]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { email, password } = data;
    if (authType === 'Sign Up') {
      try {
        const res = await firebaseRegister(email, password);
        console.log('sign up', res);
        sessionStorage.setItem('user', 'true');
        router.push('/');
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to sign in');
        }
      }
    }
    if (authType === 'Sign In') {
      try {
        const res = await login(email, password);
        console.log('res', res);
        sessionStorage.setItem('user', 'true');
        setError(null);
        router.push('/');
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to sign in');
        }
      }
    }
  };

  return (
    <div className={styles.auth}>
      <h1>{authType}</h1>
      <form className={styles.auth__form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.auth__item}>
          <label htmlFor="email" className={styles.auth__label}>
            Email
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
            Password
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
        <button type="submit" disabled={!isValid}>
          {authType}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
