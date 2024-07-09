import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import * as RouterDom from 'react-router-dom';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import ErrorBoundary from '@/components/errorBoundary';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual<typeof RouterDom>('react-router-dom');
  return {
    ...mod,
    useRouteError: vi.fn(() => new Error('Test error')),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, replaceObject?: Record<string, string>) => {
      if (!replaceObject) {
        return key;
      }
      const replacements = Object.keys(replaceObject)
        .map((replaceKey) => `_${replaceKey}:${replaceObject[replaceKey]}`)
        .join('');
      return `${key}${replacements}`;
    },
  }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const mod = await importOriginal<
    typeof import('@ovh-ux/manager-react-shell-client')
  >();
  const navigateTo = vi.fn();
  const reload = vi.fn();
  return {
    ...mod,
    useNavigation: () => ({
      navigateTo,
      reload,
    }),
  };
});

describe('ErrorBoundary component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should display the error boundary component', async () => {
    render(<ErrorBoundary />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });
  it('should navigate to home page when button is clicked', async () => {
    render(<ErrorBoundary />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('errorBoundaryGoToHomepage'));
    });
    await waitFor(async () => {
      expect(screen.getByText('Test error')).toBeInTheDocument();
      expect(useNavigation().navigateTo).toHaveBeenCalled();
      expect(useNavigation().reload).not.toHaveBeenCalled();
    });
  });
  it('should reload page when button is clicked', async () => {
    render(<ErrorBoundary />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('errorBoundaryReload'));
    });
    await waitFor(async () => {
      expect(screen.getByText('Test error')).toBeInTheDocument();
      expect(useNavigation().navigateTo).not.toHaveBeenCalled();
      expect(useNavigation().reload).toHaveBeenCalled();
    });
  });
  it('should display the ovhquery if it is provided in the error', async () => {
    class ErrorWithQueryId extends Error {
      xOvhQueryId: string;

      constructor(message: string, xOvhQueryId: string) {
        super(message);
        this.xOvhQueryId = xOvhQueryId;
      }
    }
    const errorMessage = 'Error with id';
    const queryId = 'mockedQueryId';
    vi.mocked(RouterDom.useRouteError).mockImplementation(
      () => new ErrorWithQueryId(errorMessage, queryId),
    );
    render(<ErrorBoundary />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(async () => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes(queryId)),
      ).toBeInTheDocument();
    });
  });
  it('should not render anything if error is not of type Error', async () => {
    vi.mocked(RouterDom.useRouteError).mockImplementation(() => null);
    const { container } = render(<ErrorBoundary />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(async () => {
      expect(container.childNodes).toHaveLength(1);
    });
  });
});
