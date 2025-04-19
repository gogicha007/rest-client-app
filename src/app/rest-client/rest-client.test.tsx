import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RestClientLayout from './layout';
import RestClientPage from './page';
import DeletePage from './delete/page';
import GetPage from './get/page';
import HeadPage from './head/page';
import OptionsPage from './options/page';
import PatchPage from './patch/page';
import PostPage from './post/page';
import PutPage from './put/page';
import TracePage from './trace/page';

jest.mock('@/components/rest-client', () => ({
  RestClient: () => (
    <div data-testid="rest-client-mock">RestClient Component</div>
  ),
}));

describe('RestClient', () => {
  it('RestClientLayout', () => {
    render(<RestClientLayout />);
    expect(screen.getByTestId('rest-client-mock')).toBeInTheDocument();
  });
  it('RestClientPage', () => {
    render(<RestClientPage />);
    expect(screen.getByTestId('rest-client-mock')).toBeInTheDocument();
  });
});

describe('Rest client pages', () => {
  it('DeletePage', () => {
    const { container } = render(<DeletePage />);
    expect(container.firstChild).toBeNull();
  });
  it('GetPage', () => {
    const { container } = render(<GetPage />);
    expect(container.firstChild).toBeNull();
  });
  it('HeadPage', () => {
    const { container } = render(<HeadPage />);
    expect(container.firstChild).toBeNull();
  });
  it('OptionsPage', () => {
    const { container } = render(<OptionsPage />);
    expect(container.firstChild).toBeNull();
  });
  it('PatchPage', () => {
    const { container } = render(<PatchPage />);
    expect(container.firstChild).toBeNull();
  });
  it('PostPage', () => {
    const { container } = render(<PostPage />);
    expect(container.firstChild).toBeNull();
  });
  it('PutPage', () => {
    const { container } = render(<PutPage />);
    expect(container.firstChild).toBeNull();
  });
  it('TracePage', () => {
    const { container } = render(<TracePage />);
    expect(container.firstChild).toBeNull();
  });
});
