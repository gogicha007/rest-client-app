import styles from './auth-bar.module.scss';
import { useTranslations } from 'next-intl';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

const AuthBar = () => {
  const [user] = useAuthState(auth);
  const tA = useTranslations('AuthForm');
  const router = useRouter();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('signed out');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className={styles['auth-bar']}>
      {!user && (<div className={styles['auth-bar__login']}>
        <button onClick={() => router.push('/sign-up')}>
          {tA('register')}
        </button>
        <button onClick={() => router.push('/sign-in')}>{tA('login')}</button>
      </div>)}
      {user && (
      <div className={styles['auth-bar__logout']}>
        <button onClick={handleLogout}>{tA('logout')}</button>
      </div>)}
    </div>
  );
};

export default AuthBar;
