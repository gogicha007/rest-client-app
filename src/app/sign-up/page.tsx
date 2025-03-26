'use client';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase/config';
import AuthForm from '@/components/auth-form/authForm';

const SignUp = () => {
  const [createUserWithEmailAndPassword, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const signUp = async (email: string, password: string) => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', 'true');
    } catch (error) {
      console.error(error);
    }
  };

  return <AuthForm authType="Sign Up" authFunction={signUp} />;
};

export default SignUp;
