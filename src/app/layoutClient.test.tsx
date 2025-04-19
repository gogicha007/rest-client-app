import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LayoutClient from './layoutClient';

describe('LayoutClient', () => {
  beforeEach(() => {
    const header = document.createElement('header');
    document.body.appendChild(header);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('adds "scrolled" class to header on scroll down', () => {
    render(
      <LayoutClient>
        <div>Test content</div>
      </LayoutClient>
    );

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });

    fireEvent.scroll(window);

    const header = document.querySelector('header');
    expect(header).toHaveClass('scrolled');
  });

  it('removes "scrolled" class when scrolled back to top', () => {
    const header = document.querySelector('header')!;
    header.classList.add('scrolled');

    render(
      <LayoutClient>
        <div>Test content</div>
      </LayoutClient>
    );

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

    fireEvent.scroll(window);

    expect(header).not.toHaveClass('scrolled');
  });

  it('cleans up scroll event on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <LayoutClient>
        <div>Test content</div>
      </LayoutClient>
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
  });
});
