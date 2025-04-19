import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import History from './page';
import { onAuthStateChanged } from 'firebase/auth';

type AuthStateChangedCallback = (user: { uid: string } | null) => void;
type OnAuthStateChanged = (
  auth: unknown,
  callback: AuthStateChangedCallback
) => void;

jest.mock('@/utils/firebaseConfig', () => ({
  auth: {
    currentUser: null,
  },
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/loader/loader', () => {
  const MockLoader = () => <div>Loading...</div>;
  MockLoader.displayName = 'MockLoader';
  return MockLoader;
});

jest.mock('./HistoryContent', () => {
  const MockHistoryContent = () => <div>History Content</div>;
  MockHistoryContent.displayName = 'MockHistoryContent';
  return MockHistoryContent;
});

describe('History Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders the loader while checking authentication', () => {
    const mockAuthState = jest.fn<OnAuthStateChanged>(
      (_: unknown, callback: AuthStateChangedCallback) => {
        callback({ uid: '123' });
      }
    );

    (
      onAuthStateChanged as unknown as jest.Mock<OnAuthStateChanged>
    ).mockImplementation(mockAuthState);

    render(<History />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the HistoryContent component if user is authenticated', async () => {
    const mockAuthState = jest.fn<OnAuthStateChanged>(
      (_: unknown, callback: AuthStateChangedCallback) => {
        callback({ uid: '123' });
      }
    );

    (
      onAuthStateChanged as unknown as jest.Mock<OnAuthStateChanged>
    ).mockImplementation(mockAuthState);

    render(<History />);
    expect(await screen.findByText('History Content')).toBeInTheDocument();
  });
});
