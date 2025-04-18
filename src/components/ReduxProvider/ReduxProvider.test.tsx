import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReduxProvider } from './ReduxProvider';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const TestComponent = () => {
  const state = useSelector<RootState, RootState>((state) => state);
  return (
    <div>Redux is working: {Object.keys(state).length > 0 ? 'yes' : 'no'}</div>
  );
};

describe('ReduxProvider', () => {
  it('renders children and provides redux store context', () => {
    render(
      <ReduxProvider>
        <TestComponent />
      </ReduxProvider>
    );

    expect(screen.getByText(/Redux is working/)).toBeInTheDocument();
  });
});
