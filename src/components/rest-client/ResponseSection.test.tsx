import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import ResponseSection from './ResponseSection';
import '@testing-library/jest-dom';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'title',
      headers_title: 'headers_title',
      body_title: 'body_title',
      send_button: 'send_button',
      sending: 'sending',
      url_error: 'url_error',
      error: 'error',
    };
    return translations[key] || key;
  },
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      uid: 'test-user-id',
    },
  })),
}));

jest.mock('@/utils/firebaseConfig', () => ({
  saveRequestData: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/rest-client/get'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

jest.mock('@/store/hooks', () => ({
  useAppSelector: jest.fn(() => ({
    variables: [],
  })),
}));

describe('ResponseSection', () => {
  const mockRequestData = {
    method: 'GET',
    url: 'https://api.example.com',
    headers: {
      'Content-Type': 'application/json',
    },
    body: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ message: 'success' }),
      text: () => Promise.resolve('{"message": "success"}'),
    });
  });

  it('renders the component', () => {
    render(<ResponseSection requestData={mockRequestData} />);
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('send_button')).toBeInTheDocument();
  });

  it('sends request and shows response', async () => {
    render(<ResponseSection requestData={mockRequestData} />);

    const sendButton = screen.getByText('send_button');

    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      expect(screen.getByText('headers_title')).toBeInTheDocument();
      expect(screen.getByText('body_title')).toBeInTheDocument();
    });
  });

  it('handles request error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    render(<ResponseSection requestData={mockRequestData} />);

    const sendButton = screen.getByText('send_button');

    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('shows loading state', async () => {
    render(<ResponseSection requestData={mockRequestData} />);

    const sendButton = screen.getByText('send_button');

    await act(async () => {
      fireEvent.click(sendButton);
    });

    expect(sendButton).toBeInTheDocument();
  });

  it('displays response data', async () => {
    render(<ResponseSection requestData={mockRequestData} />);

    const sendButton = screen.getByText('send_button');

    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      expect(screen.getByText('headers_title')).toBeInTheDocument();
      expect(screen.getByText('body_title')).toBeInTheDocument();

      const responseBody = screen.getByText(/message/i);
      expect(responseBody).toBeInTheDocument();
      expect(responseBody.textContent).toContain('success');
    });
  });
});
