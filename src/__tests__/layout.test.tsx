import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from '@/app/layout';

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

jest.mock('@/app/layoutClient', () => {
  const MockLayoutClient = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-client">{children}</div>
  );
  MockLayoutClient.displayName = 'MockLayoutClient';
  return MockLayoutClient;
});

jest.mock('next-intl', () => ({
  useTranslations: jest.fn().mockImplementation(() => (key: string) => key),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="intl-provider">{children}</div>
  ),
}));

describe('RootLayout', () => {
  it('renders the layout with children', async () => {
    const children = (
      <div>
        Test Content<span>hello</span>
      </div>
    );

    render(await RootLayout({ children }));

    expect(screen.getByText('Mock Header')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('Mock Footer')).toBeInTheDocument();
  });

  it('renders with correct language attribute', async () => {
    const children = <div>Test Content</div>;

    render(await RootLayout({ children }));

    const htmlElement = document.querySelector('html');
    expect(htmlElement).toHaveAttribute('lang', 'en');
  });

  it('renders the correct structure with header, main, and footer', async () => {
    const children = <div>Test Content</div>;

    render(await RootLayout({ children }));

    expect(screen.getByTestId('layout-client')).toBeInTheDocument();
    expect(document.querySelector('main')).toBeInTheDocument();
    expect(document.querySelector('header')).toBeInTheDocument();
    expect(document.querySelector('footer')).toBeInTheDocument();
  });

  it('handles error when fetching locale and messages', async () => {
    const mockGetLocale = (jest.requireMock('next-intl/server') as { getLocale: jest.Mock }).getLocale;
    const mockGetMessages = (jest.requireMock('next-intl/server') as { getMessages: jest.Mock }).getMessages;

    mockGetLocale.mockRejectedValueOnce(new Error('Failed to get locale') as never);
    mockGetMessages.mockRejectedValueOnce(new Error('Failed to get messages') as never);

    const children = <div>Test Content</div>;

    render(await RootLayout({ children }));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    const htmlElement = document.querySelector('html');
    expect(htmlElement).toHaveAttribute('lang', 'en');
  });
});
