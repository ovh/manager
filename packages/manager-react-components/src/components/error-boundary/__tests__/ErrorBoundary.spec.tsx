import { vitest } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import { useRouteError } from 'react-router-dom';
import tradFr from '../../error/translations/Messages_fr_FR.json';
import { render } from '../../../utils/test.provider';
import { ErrorBoundary } from '../ErrorBoundary.component';
import { ErrorProps, ErrorObject } from '../../error/Error.types';
import { ErrorBoundaryProps } from '../ErrorBoundary.props';

vitest.mock('react-router-dom', () => ({
  useRouteError: vitest.fn(),
  useMatches: () => ({
    pathname: 'vrackServices',
  }),
}));

export const shellContext = {
  shell: {
    environment: {
      getEnvironment: vitest.fn(),
    },
    tracking: {
      trackPage: vitest.fn(),
    },
    navigation: {
      navigateTo: vitest.fn(),
      reload: vitest.fn(),
    },
    ux: {
      hidePreloader: vitest.fn(),
    },
  },
};

export const defaultProps: ErrorProps = {
  error: {
    headers: { 'x-ovh-queryid': '123456789' },
    data: { message: "Votre requête n'a pas abouti" },
    status: 404,
  },
};

export const setupSpecTest = (
  customProps?: Partial<ErrorBoundaryProps>,
  error?: ErrorObject,
) => {
  // Set up default mock return value for useRouteError
  (useRouteError as any).mockReturnValue({
    response: {
      data: { message: "Votre requête n'a pas abouti" },
      headers: { 'x-ovh-queryid': '123456789' },
      status: 404,
    },
  });

  return render(
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      <ErrorBoundary redirectionApp="test" />
    </ShellContext.Provider>,
  );
};

describe('ErrorBoundary Tests render without error', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it('should render Error component when error occurs', () => {
    setupSpecTest();

    const img = screen.getByAltText('OOPS');
    const title = screen.queryByText(tradFr.manager_error_page_title);
    const errorMessage = screen.queryByText(tradFr.manager_error_page_default);

    expect(img).not.toBeNull();
    expect(title).toBeTruthy();
    expect(errorMessage).toBeTruthy();
  });

  it('should call useRouteError hook', () => {
    setupSpecTest();
    expect(useRouteError).toHaveBeenCalled();
  });

  it('should render Error component when error occurs', () => {
    setupSpecTest();

    const img = screen.getByAltText('OOPS');
    const title = screen.queryByText(tradFr.manager_error_page_title);
    const errorMessage = screen.queryByText(tradFr.manager_error_page_default);
    expect(img).not.toBeNull();
    expect(title).toBeTruthy();
    expect(errorMessage).toBeTruthy();
  });

  it('should call navigateToHomePage when onRedirectHome is called', () => {
    setupSpecTest();
    const navigateToHomePage = screen.getByText(
      tradFr.manager_error_page_action_home_label,
    );
    expect(navigateToHomePage).toBeTruthy();
    fireEvent.click(navigateToHomePage);
    expect(shellContext.shell.navigation.navigateTo).toHaveBeenCalledWith(
      'test',
      '',
      {},
    );
  });

  it('should call reload when onRedirectReload is called', () => {
    setupSpecTest();
    const reload = screen.getByText(
      tradFr.manager_error_page_action_reload_label,
    );
    expect(reload).toBeTruthy();
    fireEvent.click(reload);
    expect(shellContext.shell.navigation.reload).toHaveBeenCalled();
  });

  it('should display ShellRoutingSync if isRouteShellSync is true', () => {
    setupSpecTest({ isRouteShellSync: true });
    const shellRoutingSync = screen.getByText(
      tradFr.manager_error_page_action_reload_label,
    );
    expect(shellRoutingSync).toBeTruthy();
  });

  it('should not call hidePreloader when isPreloaderHide is false', () => {
    setupSpecTest({ isPreloaderHide: false });
    expect(shellContext.shell.ux.hidePreloader).not.toHaveBeenCalled();
  });

  it('should render ShellRoutingSync component when isRouteShellSync is true', () => {
    setupSpecTest({ isRouteShellSync: true });
    expect(screen.getByTestId('error-template-action-reload')).toBeTruthy();
  });

  it('should not render ShellRoutingSync component when isRouteShellSync is false', () => {
    setupSpecTest({ isRouteShellSync: false });
    expect(screen.getByTestId('error-template-action-reload')).toBeTruthy();
  });
});
