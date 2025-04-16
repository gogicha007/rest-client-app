import { jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '@/context/auth';
import { ReduxProvider } from '@/store/ReduxProvider';

jest.mock('next-intl/server', () => ({
  getLocale: jest.fn<() => Promise<string>>().mockResolvedValue('en'),
  getMessages: jest
    .fn<() => Promise<Record<string, unknown>>>()
    .mockResolvedValue({}),
}));
jest.mock('next-intl', () => ({
  useTranslations: jest.fn().mockImplementation(() => (key: string) => key),
}));
jest.mock('@/context/auth', () => {
  const AuthProvider = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );
  AuthProvider.displayName = 'AuthProvider';
  return { AuthProvider };
});

jest.mock('@/store/ReduxProvider', () => {
  const ReduxProvider = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );
  ReduxProvider.displayName = 'ReduxProvider';
  return { ReduxProvider };
});

jest.mock('@/components/header/header', () => {
  const MockHeader = () => <header>Mock Header</header>;
  MockHeader.displayName = 'MockHeader';
  return MockHeader;
});

jest.mock('@/components/footer/footer', () => {
  const MockFooter = () => <footer>Mock Footer</footer>;
  MockFooter.displayName = 'MockFooter';
  return MockFooter;
});
jest.mock('../app/layoutClient', () => {
  const LayoutClient = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );
  LayoutClient.displayName = 'LayoutClient';
  return LayoutClient;
});

import RootLayout from '../app/layout';

describe('RootLayout', () => {
  it('renders the layout with children', async () => {
    const children = <div>Test Content<span>hello</span></div>;

    await waitFor(() => {
      render(
        <AuthProvider>
          <ReduxProvider>
            <RootLayout>{children}</RootLayout>
          </ReduxProvider>
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Mock Header')).toBeInTheDocument();
    });
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Mock Footer')).toBeInTheDocument();
  });
});
