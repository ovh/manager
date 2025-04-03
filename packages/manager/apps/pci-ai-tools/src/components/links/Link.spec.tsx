import { act, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import * as useLoadingIndicator from '@/contexts/LoadingIndicator.context';
import Link from './Link.component';

describe('Link', () => {
  const useLoadingIndicatorSpy = vi.spyOn(
    useLoadingIndicator,
    'useLoadingIndicatorContext',
  );
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders RouterLink element correctly', () => {
    const { container } = render(
      <useLoadingIndicator.LoadingIndicatorProvider>
        <Router>
          <Link to="/route">Link</Link>
        </Router>
      </useLoadingIndicator.LoadingIndicatorProvider>,
    );
    const routerLink = container.querySelector('a');
    expect(routerLink).toBeTruthy();
    expect(routerLink.textContent).toBe('Link');
    expect(routerLink.getAttribute('href')).toBe('/route');
  });

  it('should set loading indicator on click', async () => {
    const mockLoading = vi.fn();
    useLoadingIndicatorSpy.mockImplementation(() => ({
      loading: false,
      setLoading: mockLoading,
    }));
    const { container } = render(
      <useLoadingIndicator.LoadingIndicatorProvider>
        <Router>
          <Link to="#">Link</Link>
        </Router>
      </useLoadingIndicator.LoadingIndicatorProvider>,
    );

    const routerLink = container.querySelector('a');
    expect(mockLoading).not.toHaveBeenCalled();
    act(() => {
      if (routerLink) {
        fireEvent.click(routerLink);
      }
    });
    expect(mockLoading).toHaveBeenCalled();
  });

  it('should not set loading indicator when clicked on disabled link', async () => {
    const mockLoading = vi.fn();
    useLoadingIndicatorSpy.mockImplementation(() => ({
      loading: false,
      setLoading: mockLoading,
    }));
    const { container } = render(
      <useLoadingIndicator.LoadingIndicatorProvider>
        <Router>
          <Link to="#" disabled>
            Link
          </Link>
        </Router>
      </useLoadingIndicator.LoadingIndicatorProvider>,
    );

    const routerLink = container.querySelector('a');
    expect(mockLoading).not.toHaveBeenCalled();
    act(() => {
      if (routerLink) {
        fireEvent.click(routerLink);
      }
    });
    expect(mockLoading).not.toHaveBeenCalled();
  });
});
