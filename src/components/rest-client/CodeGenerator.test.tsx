import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CodeGenerator from './CodeGenerator';
import '@testing-library/jest-dom';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('postman-code-generators', () => ({
  // _ - unused fns before callback
  convert: jest.fn((_, __, ___, ____, callback) =>
    callback(null, 'generated code')
  ),
  getLanguageList: jest.fn(() => [
    {
      key: 'csharp',
      label: 'C#',
      variants: [{ key: 'HttpClient', label: 'HttpClient' }],
    },
    {
      key: 'javascript',
      label: 'JavaScript',
      variants: [
        { key: 'fetch', label: 'Fetch' },
        { key: 'axios', label: 'Axios' },
      ],
    },
  ]),
}));

jest.mock('postman-collection', () => ({
  Request: jest.fn().mockImplementation(() => ({
    toJSON: jest.fn().mockReturnValue({
      method: 'GET',
      url: 'https://api.example.com',
      header: [],
      body: undefined,
    }),
  })),
}));

jest.mock('@/utils/utils', () => ({
  replaceTemplateVariables: jest.fn((text) => text),
}));

jest.mock('@/store/hooks', () => ({
  useAppSelector: jest.fn(() => ({
    variables: [],
  })),
}));

describe('CodeGenerator', () => {
  const mockRequestData = {
    method: 'GET',
    url: 'https://api.example.com',
    headers: {
      'Content-Type': 'application/json',
    },
    body: '',
  };

  it('renders and generates code', () => {
    render(<CodeGenerator requestData={mockRequestData} />);

    const selector = screen.getByRole('combobox');
    expect(selector).toBeInTheDocument();

    const codeBlock = screen.getByText('generated code');
    expect(codeBlock).toBeInTheDocument();
  });

  it('handles language selection', () => {
    render(<CodeGenerator requestData={mockRequestData} />);

    const selector = screen.getByRole('combobox');
    fireEvent.change(selector, { target: { value: 'C# - HttpClient' } });

    const codeBlock = screen.getByText('generated code');
    expect(codeBlock).toBeInTheDocument();
  });
});
