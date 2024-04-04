import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import { A, Link, OvhLink, NavLink } from '@/components/links';
import * as useLoadingIndicator from '@/contexts/loadingIndicatorContext';

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: () => ({
    getURL: vi.fn((app: string, path: string) => `#mockedurl-${app}${path}`),
  }),
}));

describe('A', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders anchor element correctly', () => {
    const { container } = render(<A href="#">Link</A>);
    const anchor = container.querySelector('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveTextContent('Link');
    expect(anchor).toHaveAttribute('href', '#');
  });
  it('renders disabled anchor element correctly', () => {
    const { container } = render(
      <A href="#" disabled>
        Link
      </A>,
    );
    const anchor = container.querySelector('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveTextContent('Link');
    expect(anchor).not.toHaveAttribute('href');
  });
});

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
describe('OvhLink component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should render anchor element with href fetched from navigation', async () => {
    render(
      <OvhLink application="app" path="/some-path">
        Link
      </OvhLink>,
    );
    const anchorElement = screen.getByText('Link');
    await waitFor(() => {
      expect(anchorElement).toHaveAttribute('href', '#mockedurl-app/some-path');
    });
  });
});
