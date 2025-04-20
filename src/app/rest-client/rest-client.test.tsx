import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RestClientLayout from './layout';
import DeletePage from './delete/page';
import GetPage from './get/page';
import HeadPage from './head/page';
import OptionsPage from './options/page';
import PatchPage from './patch/page';
import PostPage from './post/page';
import PutPage from './put/page';
import TracePage from './trace/page';
import RestClientPage from './page';

jest.mock('@/components/rest-client', () => ({
  RestClient: () => (
    <div data-testid="rest-client-mock">RestClient Component</div>
  ),
}));

jest.mock('@/components/rest-client/RestClient', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="rest-client-component">Rest Client Component</div>
    ),
  };
});

jest.mock('@/components/loader/loader', () => {
  const Loader = () => <div data-testid="loader">Loading...</div>;
  Loader.displayName = 'Loader';
  return Loader;
});

let isDynamicComponentLoaded = false;
jest.mock(
  'next/dynamic',
  () => (_: unknown, options: { loading: () => React.ReactNode }) => {
    const DynamicComponent = () => {
      if (!isDynamicComponentLoaded) {
        return options?.loading?.() || null;
      }
      return <div data-testid="dynamic-component">Dynamic Component</div>;
    };
    return DynamicComponent;
  }
);

beforeEach(() => {
  isDynamicComponentLoaded = false;
});

describe('RestClient Layout', () => {
  it('renders children correctly', () => {
    render(
      <RestClientLayout>
        <div>Test Child</div>
      </RestClientLayout>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.getByText('REST Client')).toBeInTheDocument();
  });
});

describe('RestClientPage', () => {
  it('should render the loader initially', async () => {
    render(<RestClientPage />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render the RestClient component after loading', async () => {
    render(<RestClientPage />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    act(() => {
      isDynamicComponentLoaded = true;
    });

    render(<RestClientPage />);

    expect(screen.getByTestId('dynamic-component')).toBeInTheDocument();
  });
});

describe('Rest client method pages', () => {
  const testLazyLoading = (Component: React.ComponentType, name: string) => {
    describe(`${name}Page`, () => {
      it('should render the loader initially', async () => {
        render(<Component />);
        expect(screen.getByTestId('loader')).toBeInTheDocument();
      });

      it(`should render the RestClient component after loading`, async () => {
        render(<Component />);

        expect(screen.getByTestId('loader')).toBeInTheDocument();

        act(() => {
          isDynamicComponentLoaded = true;
        });

        render(<Component />);

        expect(screen.getByTestId('dynamic-component')).toBeInTheDocument();
      });
    });
  };

  testLazyLoading(GetPage, 'Get');
  testLazyLoading(PostPage, 'Post');
  testLazyLoading(PutPage, 'Put');
  testLazyLoading(DeletePage, 'Delete');
  testLazyLoading(PatchPage, 'Patch');
  testLazyLoading(HeadPage, 'Head');
  testLazyLoading(OptionsPage, 'Options');
  testLazyLoading(TracePage, 'Trace');
});
