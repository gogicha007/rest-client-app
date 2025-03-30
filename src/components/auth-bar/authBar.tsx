import styles from './auth-bar.module.scss';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { logout } from '@/utils/firebaseConfig';

const AuthBar = () => {
  const { currentUser } = useAuth();
  const tA = useTranslations('AuthForm');
  const router = useRouter();

  return (
    <div className={styles['auth-bar']}>
      {!currentUser && (
        <div className={styles['auth-bar__login']}>
          <button onClick={() => router.push('/sign-up')}>
            {tA('register')}
          </button>
          <button onClick={() => router.push('/sign-in')}>{tA('login')}</button>
        </div>
      )}
      {currentUser && (
        <div className={styles['auth-bar__logout']}>
          <button onClick={() => logout()}>
            {tA('logout')}, {currentUser.email}
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthBar;
