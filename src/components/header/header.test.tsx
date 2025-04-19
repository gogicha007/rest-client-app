import { render, screen } from '@testing-library/react';
import Header from './header';
import { useAuth } from '@/context/auth';
import { useTranslations, useLocale } from 'next-intl';
import type { SVGProps } from 'react';
import '@testing-library/jest-dom';

jest.mock('@/context/auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
  useLocale: jest.fn(() => 'en'),
}));

jest.mock('@/utils/firebaseConfig', () => ({
  auth: {},
  db: {},
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  saveRequestData: jest.fn(),
  getRequestHistory: jest.fn(),
}));

jest.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      return <img {...props} data-testid="mocked-image" />;
    },
  };
});

jest.mock('../../../public/logo.svg', () => {
  const LogoMock = (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg {...props} data-testid="mocked-svg">
        Mocked RSS
      </svg>
    );
  };
  LogoMock.displayName = 'Logo';
  return {
    __esModule: true,
    default: LogoMock,
  };
});

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

jest.mock('../locale-switcher/LocaleSwitcher', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="locale-switcher">Locale Switcher</div>,
  };
});

jest.mock('../auth-bar/authBar', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="auth-bar">Auth Bar</div>,
  };
});

describe('Header', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('renders the logo in development environment', () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });
    (useTranslations as jest.Mock).mockReturnValue((key: string) => key);
    (useLocale as jest.Mock).mockReturnValue('en');

    render(<Header />);

    expect(screen.getByTestId('mocked-svg')).toBeInTheDocument();
  });

  it('renders the logo in production environment', () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });
    (useTranslations as jest.Mock).mockReturnValue((key: string) => key);
    (useLocale as jest.Mock).mockReturnValue('en');

    render(<Header />);

    expect(screen.getByTestId('mocked-image')).toBeInTheDocument();
  });

  it('renders navigation links when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { name: 'Test User' },
    });
    (useTranslations as jest.Mock).mockReturnValue((key: string) => key);
    (useLocale as jest.Mock).mockReturnValue('en');

    render(<Header />);

    expect(screen.getByText('home')).toBeInTheDocument();
    expect(screen.getByText('rest-client')).toBeInTheDocument();
    expect(screen.getByText('history')).toBeInTheDocument();
    expect(screen.getByText('variables')).toBeInTheDocument();
  });

  it('does not render navigation links when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });
    (useTranslations as jest.Mock).mockReturnValue((key: string) => key);
    (useLocale as jest.Mock).mockReturnValue('en');

    render(<Header />);

    expect(screen.queryByText('home')).not.toBeInTheDocument();
    expect(screen.queryByText('rest-client')).not.toBeInTheDocument();
    expect(screen.queryByText('history')).not.toBeInTheDocument();
    expect(screen.queryByText('variables')).not.toBeInTheDocument();
  });
});
