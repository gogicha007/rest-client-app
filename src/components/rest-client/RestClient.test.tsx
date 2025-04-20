import React from 'react';
import { render, screen } from '@testing-library/react';
import RestClient from './RestClient';
import '@testing-library/jest-dom';

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
});
