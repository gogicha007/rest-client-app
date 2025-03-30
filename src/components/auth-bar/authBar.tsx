import styles from './auth-bar.module.scss';
import { useTranslations } from 'next-intl';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';

const AuthBar = () => {
  const {currentUser} = useAuth();
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
      {!currentUser && (<div className={styles['auth-bar__login']}>
        <button onClick={() => router.push('/sign-up')}>
          {tA('register')}
        </button>
        <button onClick={() => router.push('/sign-in')}>{tA('login')}</button>
      </div>)}
      {currentUser && (
      <div className={styles['auth-bar__logout']}>
        <button onClick={handleLogout}>{tA('logout')}, {currentUser.email}</button>
      </div>)}
    </div>
  );
};

export default AuthBar;
