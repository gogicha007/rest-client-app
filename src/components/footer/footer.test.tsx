import { render, screen } from '@testing-library/react';
import Footer from './footer';
import '@testing-library/jest-dom';
import { developersData } from '@/types/developersData';
import type { SVGProps } from 'react';

jest.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      return <img {...props} data-testid="mocked-image" />;
    },
  };
});

jest.mock('../../../public/rss.svg', () => {
  const RssMock = (props: SVGProps<SVGSVGElement>) => {
    return <svg {...props}>Mocked RSS</svg>;
  };
  RssMock.displayName = 'RssMock';
  return {
    __esModule: true,
    default: RssMock,
  };
});

describe('Footer', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('renders project title and link to repo', () => {
    render(<Footer />);
    expect(screen.getByText(/QueryMasters/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /QueryMasters/i })).toHaveAttribute(
      'href',
      expect.stringContaining('github.com')
    );
  });

  it('renders all developer links', () => {
    render(<Footer />);
    developersData.forEach((dev) => {
      expect(screen.getByText(dev.initials)).toBeInTheDocument();
      expect(screen.getByText(dev.name)).toBeInTheDocument();
    });
  });

  it('renders svg component in development mode', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      configurable: true,
    });

    render(<Footer />);
    expect(screen.getByText(/Mocked RSS/i)).toBeInTheDocument();
  });

  it('renders Image in production mode', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      configurable: true,
    });

    render(<Footer />);
    const rssImage = screen.getByTestId('mocked-image');
    expect(rssImage).toBeInTheDocument();
    expect(rssImage).toHaveAttribute('alt', 'RssLogo');
  });
});
