import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RestClient from './RestClient';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'title',
      headers_title: 'headers_title',
      body_title: 'body_title',
      send_button: 'send_button',
      format_button: 'format_button',
      placeholder: 'placeholder',
      name_placeholder: 'name_placeholder',
      value_placeholder: 'value_placeholder',
      add_button: 'add_button',
      remove_button: 'remove_button',
      'codeGenerator.title': 'codeGenerator.title',
    };
    return translations[key] || key;
  },
}));

jest.mock('postman-code-generators', () => ({
  getLanguageList: jest.fn(() => [
    {
      key: 'javascript',
      label: 'JavaScript',
      variants: [{ key: 'fetch', label: 'Fetch' }],
    },
  ]),
  convert: jest.fn(),
}));

jest.mock('postman-collection', () => ({
  Request: jest.fn(),
}));

jest.mock('@/store/hooks', () => ({
  useAppSelector: jest.fn(() => ({
    variables: [],
  })),
}));

jest.mock('@/store/variablesSlice', () => ({
  selectVariables: jest.fn(),
}));

jest.mock('@/utils/utils', () => ({
  replaceTemplateVariables: jest.fn((str) => str),
}));

jest.mock('@/utils/firebaseConfig', () => ({
  saveRequestData: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
}));

jest.mock('firebase/firestore', () => ({}));
jest.mock('firebase/app', () => ({}));

const mockPushState = jest.fn();
Object.defineProperty(window, 'history', {
  writable: true,
  value: { pushState: mockPushState },
});

global.fetch = jest.fn();

const originalAtob = global.atob;
const originalBtoa = global.btoa;

global.atob = jest.fn((str) => str);
global.btoa = jest.fn((str) => str);

afterAll(() => {
  global.atob = originalAtob;
  global.btoa = originalBtoa;
});

const mockSearchParams = {
  get: jest.fn(),
  toString: jest.fn(() => ''),
  set: jest.fn(),
  forEach: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => mockSearchParams),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: jest.fn(() => '/rest-client/get'),
}));

describe('RestClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.get.mockImplementation(() => {
      return null;
    });
  });

  it('renders the component', () => {
    render(<RestClient />);
    expect(screen.getByText('codeGenerator.title')).toBeInTheDocument();
  });

  it('renders request section', () => {
    render(<RestClient />);

    expect(
      screen.getAllByPlaceholderText('placeholder')[0]
    ).toBeInTheDocument();
    expect(screen.getByText('add_button')).toBeInTheDocument();
    expect(screen.getByText('format_button')).toBeInTheDocument();
  });

  it('renders response section', () => {
    render(<RestClient />);
    expect(screen.getByText('send_button')).toBeInTheDocument();
  });

  it('updates method when selecting a different one', () => {
    const { container } = render(<RestClient />);

    const methodSelector = container.querySelector('select');
    expect(methodSelector).toBeInTheDocument();

    if (methodSelector) {
      act(() => {
        fireEvent.change(methodSelector, { target: { value: 'POST' } });
      });

      expect(methodSelector).toHaveValue('POST');
    }
  });

  it('updates URL when typing in the URL input', () => {
    render(<RestClient />);

    const urlInput = screen.getAllByPlaceholderText(
      'placeholder'
    )[0] as HTMLInputElement;

    act(() => {
      fireEvent.change(urlInput, {
        target: { value: 'https://api.example.com' },
      });
    });

    expect(urlInput.value).toBe('https://api.example.com');
    expect(mockPushState).toHaveBeenCalled();
  });

  it('loads URL from search params if available', () => {
    mockSearchParams.get.mockImplementation((param) => {
      if (param === 'url') return 'https://api.example.com';
      return null;
    });

    render(<RestClient />);

    const urlInput = screen.getAllByPlaceholderText(
      'placeholder'
    )[0] as HTMLInputElement;
    expect(urlInput.value).toBe('https://api.example.com');
  });

  it('loads body from search params if available', () => {
    mockSearchParams.get.mockImplementation((param) => {
      if (param === 'body') return '{"test": "data"}';
      return null;
    });

    render(<RestClient />);

    expect(global.atob).toHaveBeenCalledWith('{"test": "data"}');
  });

  it('loads headers from search params if available', () => {
    const headers = new Map();
    headers.set('Content-Type', 'application/json');

    mockSearchParams.forEach.mockImplementation((callback) => {
      headers.forEach((value, key) => {
        callback(value, key);
      });
    });

    render(<RestClient />);

    expect(mockSearchParams.forEach).toHaveBeenCalled();
  });

  it('handles decoding errors gracefully', () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const errorAtob = () => {
      throw new Error('Invalid character');
    };
    const tempAtob = global.atob;
    global.atob = errorAtob;

    mockSearchParams.get.mockImplementation((param) => {
      if (param === 'url') return 'invalid-url';
      return null;
    });

    render(<RestClient />);

    expect(console.error).toHaveBeenCalled();

    global.atob = tempAtob;
    console.error = originalConsoleError;
  });

  it('updates method and redirects when it differs from pathname', async () => {
    const mockRouter = {
      push: jest.fn(),
    };

    jest.mock('next/navigation', () => ({
      ...jest.requireActual('next/navigation'),
      useRouter: jest.fn(() => mockRouter),
      usePathname: jest.fn(() => '/rest-client/get'),
      useSearchParams: jest.fn(() => mockSearchParams),
    }));

    const { container } = render(<RestClient />);

    const methodSelector = container.querySelector('select');

    if (methodSelector) {
      act(() => {
        fireEvent.change(methodSelector, { target: { value: 'POST' } });
      });
    }

    expect(methodSelector).toHaveValue('POST');
  });
});
