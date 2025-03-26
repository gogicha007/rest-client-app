import styles from './auth-form.module.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters' })
    .regex(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{4,}$/,
      {
        message:
          'Password to contain: 1 number, 1 uppercased letter, 1 lowercased letter, 1 special character',
      }
    ),
});

type FormFields = z.infer<typeof schema>;

interface AuthFormProps {
  authType: string;
  authFunction: (email: string, password: string) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ authType, authFunction }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { email, password } = data;
      await authFunction(email, password);
    } catch (error) {
      console.error(error);
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
