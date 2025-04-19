import React from 'react';
import { render, screen } from '@testing-library/react';
import About from './about';
import '@testing-library/jest-dom';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('About component', () => {
  beforeEach(() => {
    render(<About />);
  });

  it('renders the summary title', () => {
    expect(screen.getByText('about.title')).toBeInTheDocument();
  });

  it('renders authors section', () => {
    expect(screen.getByText('about.authors')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Irakli Gogicha' })).toHaveAttribute(
      'href',
      'https://github.com/gogicha007'
    );
    expect(screen.getByRole('link', { name: 'Oleg Polovinko' })).toHaveAttribute(
      'href',
      'https://github.com/sheritsh'
    );
    expect(screen.getByRole('link', { name: 'Vlad Barvinko' })).toHaveAttribute(
      'href',
      'https://github.com/Barvinko'
    );
  });

  it('renders all localized sections', () => {
    expect(screen.getByText('about.project_header')).toBeInTheDocument();
    expect(screen.getByText('about.project_content')).toBeInTheDocument();
    expect(screen.getByText('about.course_header')).toBeInTheDocument();
    expect(screen.getByText('about.course_content')).toBeInTheDocument();
  });
});
