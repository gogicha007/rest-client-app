import { jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { logout } from '@/utils/firebaseConfig';
import AuthBar from './authBar';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/context/auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn().mockImplementation(() => (key: string) => key),
}));

jest.mock('@/utils/firebaseConfig', () => ({
  logout: jest.fn(),
}));

describe('AuthBar', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders login and register buttons when no user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });

    render(<AuthBar />);

    expect(screen.getByText('register')).toBeInTheDocument();
    expect(screen.getByText('login')).toBeInTheDocument();
  });

  it('renders logout button with user email when a user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { email: 'test@example.com' },
    });

    render(<AuthBar />);

    expect(screen.getByText('logout, test@example.com')).toBeInTheDocument();
  });

  it('calls logout and redirects to home when logout button is clicked', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { email: 'test@example.com' },
    });

    render(<AuthBar />);

    fireEvent.click(screen.getByText('logout, test@example.com'));

    expect(logout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('redirects to sign-up page when register button is clicked', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });

    render(<AuthBar />);

    fireEvent.click(screen.getByText('register'));

    expect(mockPush).toHaveBeenCalledWith('/sign-up');
  });

  it('redirects to sign-in page when login button is clicked', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });

    render(<AuthBar />);

    fireEvent.click(screen.getByText('login'));

    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });
});
