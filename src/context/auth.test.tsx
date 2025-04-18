import { jest } from '@jest/globals';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from './auth';
import { onAuthStateChanged } from 'firebase/auth';
import { isTokenExpired } from '@/utils/authUtils';
import { setCookie } from 'nookies';

type AuthStateChangedCallback = (
  user: {
    email: string;
    getIdToken: jest.Mock<() => Promise<string>>;
  } | null
) => void;

type OnAuthStateChanged = (
  auth: unknown,
  callback: AuthStateChangedCallback
) => void;

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));
jest.mock('@/utils/firebaseConfig', () => ({
  auth: {},
  logout: jest.fn(),
}));
jest.mock('@/utils/authUtils', () => ({
  isTokenExpired: jest.fn(),
}));
jest.mock('nookies', () => ({
  setCookie: jest.fn(),
}));
jest.mock('next/navigation', () => {
  const push = jest.fn();
  return {
    useRouter: jest.fn(() => ({
      push,
    })),
    usePathname: jest.fn(),
    __mockPush: push,
  };
});

const mockedNavigation = jest.requireMock('next/navigation') as {
  useRouter: jest.Mock;
  __mockPush: jest.Mock;
};

beforeEach(() => {
  mockedNavigation.__mockPush.mockClear();
  mockedNavigation.useRouter.mockClear();
});

const MockChild = () => {
  const { currentUser, loading } = useAuth();
  return (
    <div>
      <p>Loading: {loading.toString()}</p>
      <p>User: {currentUser ? currentUser.email : 'None'}</p>
    </div>
  );
};

describe('AuthProvider', () => {
  it('renders children and provides auth context', async () => {
    const mockUser = {
      email: 'test@example.com',
      getIdToken: jest
        .fn<() => Promise<string>>()
        .mockResolvedValue('mockToken'),
    };
    (
      onAuthStateChanged as unknown as jest.Mock<OnAuthStateChanged>
    ).mockImplementation((_: unknown, callback: AuthStateChangedCallback) => {
      callback(mockUser);
      return jest.fn();
    });
    (isTokenExpired as jest.Mock<() => Promise<boolean>>).mockResolvedValue(
      false
    );

    const { getByText } = render(
      <AuthProvider>
        <MockChild />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText('Loading: false')).toBeInTheDocument();
      expect(getByText('User: test@example.com')).toBeInTheDocument();
    });

    expect(setCookie).toHaveBeenCalledWith(null, 'authToken', 'mockToken', {
      path: '/',
      maxAge: 60 * 60 * 24,
    });
  });

  it('handles token expiration and logout', async () => {
    const mockUser = {
      email: 'test@example.com',
      getIdToken: jest
        .fn<() => Promise<string>>()
        .mockResolvedValue('mockToken'),
    };
    (
      onAuthStateChanged as unknown as jest.Mock<OnAuthStateChanged>
    ).mockImplementation((_, callback: AuthStateChangedCallback) => {
      callback(mockUser);
      return jest.fn();
    });
    (isTokenExpired as jest.Mock<() => Promise<boolean>>).mockResolvedValue(
      true
    );

    const { getByText } = render(
      <AuthProvider>
        <MockChild />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText('Loading: false')).toBeInTheDocument();
      expect(getByText('User: None')).toBeInTheDocument();
    });

    console.log(
      'Number of calls to router.push:',
      mockedNavigation.__mockPush.mock.calls.length
    );
    expect(mockedNavigation.__mockPush).toHaveBeenCalledTimes(1);
    expect(mockedNavigation.__mockPush).toHaveBeenCalledWith('/');
  });

  it('handles no user on auth state change', async () => {
    (
      onAuthStateChanged as unknown as jest.Mock<OnAuthStateChanged>
    ).mockImplementation((_, callback: AuthStateChangedCallback) => {
      callback(null);
      return jest.fn();
    });

    const { getByText } = render(
      <AuthProvider>
        <MockChild />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText('Loading: false')).toBeInTheDocument();
      expect(getByText('User: None')).toBeInTheDocument();
    });
  });
});
