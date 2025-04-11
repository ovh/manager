import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import Configurations from './Configuration.component';
import { mockedApp, mockedAppStatus } from '@/__tests__/helpers/mocks/app/app';

describe('Configuration component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    vi.mock('@/pages/apps/[appId]/App.context', () => ({
      useAppData: vi.fn(() => ({
        projectId: 'projectId',
        app: {
          ...mockedApp,
          status: {
            ...mockedAppStatus,
            state: ai.app.AppStateEnum.STOPPED,
          },
        },
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
      })),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Configuration', async () => {
    render(<Configurations />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('configuration-container')).toBeTruthy();
  });

  it('renders and trigger copy Id in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<Configurations />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedApp.id)).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('dashboard-copy-id-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedApp.id,
      );
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'appIdCopyToast',
      });
    });
  });

  it('open delete app modal', async () => {
    render(<Configurations />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.getByTestId('app-config-delete-button').getAttribute('disabled'),
    ).toBeNull();
    act(() => {
      fireEvent.click(screen.getByTestId('app-config-delete-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete');
    });
  });
});
