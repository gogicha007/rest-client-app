'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import AuthForm from '@/components/auth-form/authForm';
import Loading from '@/components/loader/loader';

const SignIn = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser) {
      router.push('/');
    }
  }, [router, loading, currentUser]);

  if (loading) {
    return <Loading />;
  }

  if (currentUser) {
    return null;
  }

  return <AuthForm authType="login" />;
};

export default SignIn;
