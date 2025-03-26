'use client';
import styles from './page.module.css';
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase/config';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', 'true');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.signup}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
