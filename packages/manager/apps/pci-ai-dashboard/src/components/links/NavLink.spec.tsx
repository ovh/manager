import { act, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import NavLink from '@/components/links/NavLink.component';
import * as useLoadingIndicator from '@/contexts/loadingIndicatorContext';

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: () => ({
    getURL: vi.fn((app: string, path: string) => `#mockedurl-${app}${path}`),
  }),
}));

describe('NavLink', () => {
  const useLoadingIndicatorSpy = vi.spyOn(
    useLoadingIndicator,
    'useLoadingIndicatorContext',
  );
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders NavLink element correctly', () => {
    const { container } = render(
      <useLoadingIndicator.LoadingIndicatorProvider>
        <Router>
          <NavLink to="/route">Link</NavLink>
        </Router>
      </useLoadingIndicator.LoadingIndicatorProvider>,
    );
    const routerLink = container.querySelector('a');
    expect(routerLink).toBeInTheDocument();
    expect(routerLink).toHaveTextContent('Link');
    expect(routerLink).toHaveAttribute('href', '/route');
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
          <NavLink to="#">Link</NavLink>
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
          <NavLink to="#" disabled>
            Link
          </NavLink>
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
