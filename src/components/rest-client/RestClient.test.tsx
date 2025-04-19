import React from 'react';
import { render, screen } from '@testing-library/react';
import RestClient from './RestClient';
import '@testing-library/jest-dom';

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
  replaceTemplateVariables: jest.fn(),
}));

jest.mock('@/utils/firebaseConfig', () => ({}));
jest.mock('firebase/auth', () => ({}));
jest.mock('firebase/firestore', () => ({}));
jest.mock('firebase/app', () => ({}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: jest.fn(() => '/rest-client/get'),
}));

describe('RestClient', () => {
  it('renders the component', () => {
    render(<RestClient />);
    expect(screen.getByText('Response')).toBeInTheDocument();
  });

  it('renders request section', () => {
    render(<RestClient />);

    expect(
      screen.getByPlaceholderText('Enter endpoint URL')
    ).toBeInTheDocument();
    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('Request Body')).toBeInTheDocument();
    expect(screen.getByText('Generated Code')).toBeInTheDocument();
  });

  it('renders response section', () => {
    render(<RestClient />);
    expect(screen.getByText('Response')).toBeInTheDocument();
  });
});
