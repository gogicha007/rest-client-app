import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import SignIn from '../sign-in/page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/context/auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/components/auth-form/authForm', () => {
    const MockAuthForm = () => <div>AuthForm Component</div>;
    MockAuthForm.displayName = 'MockAuthForm';
    return MockAuthForm;
  });
  
  jest.mock('@/components/loader/loader', () => {
    const MockLoader = () => <div data-testid="loader">Loader Component</div>;
    MockLoader.displayName = 'MockLoader';
    return MockLoader;
  });

describe('SignIn Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders the Loader component when loading is true', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null, loading: true });

    render(<SignIn />);


    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByText('Loader Component')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
  it('redirects to the home page if the user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: { uid: '123' }, loading: false });

    render(<SignIn />);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('renders the AuthForm component when not loading and no user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null, loading: false });

    render(<SignIn />);

    expect(screen.getByText('AuthForm Component')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not render anything if the user is logged in and loading is false', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: { uid: '123' }, loading: false });

    const { container } = render(<SignIn />);

    expect(container.firstChild).toBeNull();
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});