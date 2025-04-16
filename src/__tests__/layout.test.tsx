import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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

jest.mock('../app/layout', () => {
  const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <div>
      <header>Mock Header</header>
      {children}
      <footer>Mock Footer</footer>
    </div>
  );
  RootLayout.displayName = 'RootLayout';
  return RootLayout;
});

import RootLayout from '../app/layout';

describe('RootLayout', () => {
  it('renders the layout with children', () => {
    const children = <div>Test Content</div>;

    render(<RootLayout>{children}</RootLayout>);

    expect(screen.getByText('Mock Header')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Mock Footer')).toBeInTheDocument();
  });
});
