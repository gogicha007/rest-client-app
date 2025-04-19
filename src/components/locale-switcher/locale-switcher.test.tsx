import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocaleSwitcher from './LocaleSwitcher';
import { LocaleSwitcherSelectProps } from './LocaleSwitcherSelect';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => `translated:${key}`,
  useLocale: () => 'en',
}));

jest.mock('./LocaleSwitcherSelect', () => ({
  __esModule: true,
  default: ({ defaultValue, items, label }: LocaleSwitcherSelectProps) => (
    <div>
      <div data-testid="default-value">{defaultValue}</div>
      <div data-testid="label">{label}</div>
      {items.map((item) => (
        <div key={item.value} data-testid="item">
          {item.label} ({item.value})
        </div>
      ))}
    </div>
  ),
}));

describe('LocaleSwitcher', () => {
  it('renders with correct default locale and translated labels', () => {
    render(<LocaleSwitcher />);

    expect(screen.getByTestId('default-value')).toHaveTextContent('en');
    expect(screen.getByTestId('label')).toHaveTextContent('translated:label');
    const items = screen.getAllByTestId('item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('translated:en (en)');
    expect(items[1]).toHaveTextContent('translated:de (de)');
  });
});
