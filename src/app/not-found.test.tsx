import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotFound from './not-found'; // Укажите правильный путь к компоненту

describe('NotFound Component', () => {
  it('should display correct 404 message', () => {
    render(<NotFound />);
    expect(screen.getByText('404 | Page Not Found')).toBeInTheDocument();
  });
});
