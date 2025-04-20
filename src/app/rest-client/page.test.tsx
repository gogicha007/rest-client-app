import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RestClientPage from './page';

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => {
    const MockRestClient = () => (
      <div data-testid="rest-client">Rest Client</div>
    );
    return MockRestClient;
  },
}));

jest.mock('@/components/loader/loader', () => {
  const MockLoader = () => <div data-testid="loader">Loading...</div>;
  return MockLoader;
});

describe('RestClientPage', () => {
  it('renders the RestClient component', async () => {
    await act(async () => {
      render(<RestClientPage />);
    });

    expect(screen.getByText('REST Client')).toBeInTheDocument();
    expect(screen.getByTestId('rest-client')).toBeInTheDocument();
  });
});
