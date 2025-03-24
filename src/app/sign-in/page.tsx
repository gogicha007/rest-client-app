'use client';
import styles from './page.module.css'
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const router = useRouter();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', 'true');
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.signin}>
      <input className={styles.signin__email}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input className={styles.signing__password}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
};

export default SignIn;
