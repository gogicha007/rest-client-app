'use client';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth-form/authForm';
import Loader from '@/components/loader/loader';

const SignIn = () => {
  const [signInWithEmailAndPassword, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const router = useRouter();

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  const signIn = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      if (res?.user) {
        sessionStorage.setItem('user', 'true');
        router.push('/');
      } else {
        throw new Error('An error occured');
      }
    } catch (error) {
      console.error('an error occured', error);
    }
  };

  return <AuthForm authType="Sign In" authFunction={signIn} />;
};

export default SignIn;
