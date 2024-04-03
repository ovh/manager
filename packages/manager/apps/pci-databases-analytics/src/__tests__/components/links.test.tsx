import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import * as React from 'react';
import { vi } from 'vitest';
import { A } from '../../components/links';

// Mock du contexte useLoadingIndicatorContext
vi.mock('./../../contexts/loadingIndicatorContext', () => ({
  useLoadingIndicatorContext: () => ({
    setLoading: vi.fn(),
  }),
}));

describe('A', () => {
  it('renders anchor element correctly', () => {
    const { container } = render(<A href="#">Link</A>);
    const anchor = container.querySelector('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveTextContent('Link');
  });
});

/*
describe('Link', () => {
    it('renders RouterLink element correctly', () => {
      const { container } = render(<Link to="/">Link</Link>);
      screen.debug();
      const routerLink = container.querySelector('a');
      expect(routerLink).toBeInTheDocument();
      expect(routerLink).toHaveTextContent('Link');
    });
  });

  describe('OvhLink component', () => {
    it('should render anchor element with href fetched from navigation', () => {
      // Mocks
      const getURLMock = vi.fn().mockResolvedValue('/some-url');
      const useNavigationMock = vi.fn().mockReturnValue({ getURL: getURLMock });
  
      // Render component
      const { getByText } = render(<OvhLink application="app" path="/some-path">Link</OvhLink>);
      screen.debug();
      const anchorElement = getByText('Link');
  
      // Assertions
      expect(useNavigationMock).toHaveBeenCalled();
      expect(getURLMock).toHaveBeenCalledWith('app', '/some-path', {});
      expect(anchorElement).toHaveAttribute('href', '/some-url');
    });
  
    // Ajoutez d'autres tests selon votre besoin
    
  });
*/
