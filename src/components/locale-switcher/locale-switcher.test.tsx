import React from 'react';
import { jest } from '@jest/globals';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import { setUserLocale } from '../../services/locale';

jest.mock('../../services/locale', () => ({
  setUserLocale: jest.fn(),
}));

jest.mock('react', () => ({
  ...jest.requireActual<typeof React>('react'),
  useTransition: () => [true, (callback: () => void) => callback()],
}));

describe('LocaleSwitcherSelect', () => {
  const items = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
  ];
  afterEach(cleanup);
  it('renders correctly', () => {
    render(<LocaleSwitcherSelect defaultValue="en" items={items} />);
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument();
  });

  it('sets initial state based on defaultValue', () => {
    render(<LocaleSwitcherSelect defaultValue="en" items={items} />);
    const checkboxEn = screen.getByRole('checkbox');
    expect(checkboxEn).not.toBeChecked();

    cleanup();

    render(<LocaleSwitcherSelect defaultValue="de" items={items} />);
    const checkboxDe = screen.getByRole('checkbox');
    expect(checkboxDe).toBeChecked();
  });

  it('updates state on checkbox change', () => {
    render(<LocaleSwitcherSelect defaultValue="en" items={items} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(setUserLocale).toHaveBeenCalledWith('de');

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(setUserLocale).toHaveBeenCalledWith('en');
  });

  it('displays Loader when isPending is true', async () => {
    render(<LocaleSwitcherSelect defaultValue="en" items={items} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });
});
