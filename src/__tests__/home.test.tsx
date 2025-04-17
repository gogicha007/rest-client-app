import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../app/page'

jest.mock('next-intl', () => ({
  useTranslations: jest.fn().mockImplementation(() => (key: string) => `translated_${key}`),
}));

jest.mock('@/context/auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href} data-testid="link">{children}</a>;
  };
});

jest.mock('@/components/about/about', () => {
  const MockAbout = () => <div data-testid="about-component">About Component</div>;
  return MockAbout;
});

jest.mock('../app/page.module.scss', () => ({
  home: 'home-class',
  home__welcome: 'welcome-class',
  home__auth: 'auth-class',
  home__menu: 'menu-class',
}));

describe('Home Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When user is logged in', () => {
    beforeEach(() => {
      const mockUseAuth = (jest.requireMock('@/context/auth') as { useAuth: jest.Mock }).useAuth;
      mockUseAuth.mockReturnValue({
        currentUser: { email: 'test@example.com' }
      });
    });

    it('renders welcome message with user email', () => {
      render(<Home />);
      expect(screen.getByText('translated_welcomeBack test@example.com')).toBeInTheDocument();
    });

    it('renders menu links when user is logged in', () => {
      render(<Home />);
      expect(screen.getByText('translated_restClient')).toBeInTheDocument();
      expect(screen.getByText('translated_history')).toBeInTheDocument();
      expect(screen.getByText('translated_variables')).toBeInTheDocument();
    });

    it('does not render login/register links when user is logged in', () => {
      render(<Home />);
      expect(screen.queryByText('translated_login')).not.toBeInTheDocument();
      expect(screen.queryByText('translated_register')).not.toBeInTheDocument();
    });
  });

  describe('When user is not logged in', () => {
    beforeEach(() => {
      const mockUseAuth = (jest.requireMock('@/context/auth') as { useAuth: jest.Mock }).useAuth;
      mockUseAuth.mockReturnValue({
        currentUser: null
      });
    });

    it('renders generic welcome message', () => {
      render(<Home />);
      expect(screen.getByText('translated_welcome')).toBeInTheDocument();
    });

    it('renders login and register links', () => {
      render(<Home />);
      const links = screen.getAllByTestId('link');
      expect(links.length).toBe(2);
      expect(screen.getByText('translated_login')).toBeInTheDocument();
      expect(screen.getByText('translated_register')).toBeInTheDocument();
    });

    it('does not render menu links when user is not logged in', () => {
      render(<Home />);
      expect(screen.queryByText('translated_restClient')).not.toBeInTheDocument();
      expect(screen.queryByText('translated_history')).not.toBeInTheDocument();
      expect(screen.queryByText('translated_variables')).not.toBeInTheDocument();
    });
  });

  it('renders About component regardless of auth state', () => {
    const mockUseAuth = (jest.requireMock('@/context/auth') as { useAuth: jest.Mock }).useAuth;
    mockUseAuth.mockReturnValue({
      currentUser: null
    });
    
    render(<Home />);
    expect(screen.getByTestId('about-component')).toBeInTheDocument();
  });

  it('handles fallback when useAuth returns undefined', () => {
    const mockUseAuth = (jest.requireMock('@/context/auth') as { useAuth: jest.Mock }).useAuth;
    mockUseAuth.mockReturnValue(undefined);
    
    render(<Home />);
    expect(screen.getByText('translated_welcome')).toBeInTheDocument();
  });
});