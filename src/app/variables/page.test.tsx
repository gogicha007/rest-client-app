import { render, screen, waitFor } from '@testing-library/react';
import VariablesPage from '@/app/variables/page';
import '@testing-library/jest-dom';

jest.mock('@/components/variables/Variables', () => {
  const Variables = () => (
    <div data-testid="variables-component">Variables Component</div>
  );
  Variables.displayName = 'Variables';
  return Variables;
});

jest.mock('@/components/loader/loader', () => {
  const Loader = () => <div data-testid="loader">Loading...</div>;
  Loader.displayName = 'Loader';
  return Loader;
});

describe('VariablesPage', () => {
  it('should render the loader initially', async () => {
    render(<VariablesPage />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render the Variables component after loading', async () => {
    render(<VariablesPage />);

    await waitFor(() =>
      expect(screen.getByTestId('variables-component')).toBeInTheDocument()
    );
  });
});
