import { useRouteError } from 'react-router-dom';

import { fireEvent, screen } from '@testing-library/react';
import { vitest } from 'vitest';

import { shellContext } from '@/commons/tests-utils/Mock.utils';
import { renderWithContext } from '@/commons/tests-utils/Render.utils';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary.component';
import { ErrorProps } from '@/components/error/Error.props';

import tradFr from '../../error/translations/Messages_fr_FR.json';

vitest.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useRouteError: vitest.fn(),
    useMatches: () => ({
      pathname: 'vrackServices',
    }),
  };
});

export const defaultProps: ErrorProps = {
  error: {},
};

describe('ErrorBoundary Tests render without error', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it('should render Error component when error occurs', () => {
    renderWithContext({
      children: <ErrorBoundary redirectionApp="test" />,
    });

    const img = screen.getByAltText('OOPS');
    const title = screen.queryByText(tradFr.manager_error_page_boundary_title);
    const errorMessage = screen.queryByText(tradFr.manager_error_page_boundary_description);

    expect(img).not.toBeNull();
    expect(title).toBeTruthy();
    expect(errorMessage).toBeTruthy();
  });

  it('should call useRouteError hook', () => {
    renderWithContext({
      children: <ErrorBoundary redirectionApp="test" />,
    });
    expect(useRouteError).toHaveBeenCalled();
  });

  it('should call navigateToHomePage when onRedirectHome is called', () => {
    renderWithContext({
      children: <ErrorBoundary redirectionApp="test" />,
    });
    const navigateToHomePage = screen.getByText(tradFr.manager_error_page_action_home_label);
    expect(navigateToHomePage).toBeTruthy();
    fireEvent.click(navigateToHomePage);
    expect(shellContext.shell.navigation.navigateTo).toHaveBeenCalledWith('test', '', {});
  });

  it('should call reload when onRedirectReload is called', () => {
    renderWithContext({
      children: <ErrorBoundary redirectionApp="test" />,
    });
    const reload = screen.getByText(tradFr.manager_error_page_action_reload_label);
    expect(reload).toBeTruthy();
    fireEvent.click(reload);
    expect(shellContext.shell.navigation.reload).toHaveBeenCalled();
  });

  it('should not call hidePreloader when isPreloaderHide is false', () => {
    renderWithContext({
      children: <ErrorBoundary redirectionApp="test" isPreloaderHide={false} />,
    });
    expect(shellContext.shell.ux.hidePreloader).not.toHaveBeenCalled();
  });

  it('should not render ShellRoutingSync component when isRouteShellSync is false', () => {
    renderWithContext({
      children: <ErrorBoundary redirectionApp="test" isRouteShellSync={false} />,
    });
    expect(screen.getByTestId('error-template-action-reload')).toBeTruthy();
  });
});
