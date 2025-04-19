import { jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { getRequestHistory } from '@/utils/firebaseConfig';
import HistoryContent from './HistoryContent';

type AuthStateChangedCallback = (user: { uid: string } | null) => void;
type OnAuthStateChanged = (
  auth: unknown,
  callback: AuthStateChangedCallback
) => void;
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/firebaseConfig', () => ({
  auth: {
    currentUser: null,
  },
  getRequestHistory: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((_, callback: AuthStateChangedCallback) => {
    setTimeout(() => callback(null), 0);
    return jest.fn();
  }),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn().mockImplementation(() => (key: string) => key),
}));

jest.mock('@/components/loader/loader', () => {
  const MockLoader = () => <div>Loading...</div>;
  MockLoader.displayName = 'MockLoader';
  return MockLoader;
});

beforeEach(() => {
  (onAuthStateChanged as unknown as jest.Mock).mockReset();
  (getRequestHistory as jest.Mock).mockReset();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('HistoryContent Component', () => {
  it('renders the loader while loading', async () => {
    render(<HistoryContent />);
    expect(await screen.findByText('Loading...')).toBeInTheDocument();
  });

  it('renders an error message if user is not authenticated', async () => {
    (
      onAuthStateChanged as unknown as jest.Mock<OnAuthStateChanged>
    ).mockImplementation((_, callback) => {
      callback(null);
    });

    await waitFor(() => {
      render(<HistoryContent />);
    });

    expect(screen.getByText('User not authenticated')).toBeInTheDocument();
  });

  it('renders an error message if fetching history fails', async () => {
    (
      onAuthStateChanged as unknown as jest.Mock<OnAuthStateChanged>
    ).mockImplementation((_, callback) => {
      callback({ uid: '123' });
    });

    (getRequestHistory as jest.Mock<() => Promise<never>>).mockRejectedValue(
      new Error('Fetch failed')
    );

    await waitFor(() => {
      render(<HistoryContent />);
    });

    await expect(
      screen.findByText('Fetch failed')
    ).resolves.toBeInTheDocument();
  });

  it('renders the request history if data is available', async () => {
    (
      onAuthStateChanged as unknown as jest.Mock<OnAuthStateChanged>
    ).mockImplementation((_, callback) => {
      callback({ uid: '123' });
    });

    (
      getRequestHistory as unknown as jest.Mock<
        () => Promise<{ url: string; link: string }[]>
      >
    ).mockResolvedValue([
      { url: 'https://example.com', link: 'https://example.com' },
    ]);

    await waitFor(() => {
      render(<HistoryContent />);
    });

    await waitFor(() => {
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
    });
  });

  it('renders a message if no history is found', async () => {
    (
      onAuthStateChanged as unknown as jest.Mock<OnAuthStateChanged>
    ).mockImplementation((_, callback) => {
      callback({ uid: '123' });
    });

    (getRequestHistory as jest.Mock<() => Promise<[]>>).mockResolvedValue([]);

    await waitFor(() => {
      render(<HistoryContent />);
    });

    await waitFor(() => {
      expect(screen.getByText('noHistoryFound')).toBeInTheDocument();
    });
  });
});
