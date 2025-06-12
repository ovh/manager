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
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import ai from '@/types/AI';
import { mockedDatastoreVolume } from '@/__tests__/helpers/mocks/volume/volume';
import Containers, { breadcrumb as Breadcrumb } from './Containers.page';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';
import {
  mockedApp,
  mockedAppSpec,
  mockedAppStatus,
} from '@/__tests__/helpers/mocks/app/app';

const mockedAppWithVol: ai.app.App = {
  ...mockedApp,
  spec: {
    ...mockedAppSpec,
    volumes: [mockedDatastoreVolume],
  },
  status: {
    ...mockedAppStatus,
    state: ai.app.AppStateEnum.RUNNING,
    volumes: [
      {
        id: 'volumeId',
        mountPath: '/demo1',
        userVolumeId: 'userVolumeId',
      },
    ],
  },
};

describe('Containers page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
    mockedUsedNavigate();

    vi.mock('@/pages/apps/[appId]/App.context', () => ({
      useAppData: vi.fn(() => ({
        projectId: 'projectId',
        app: mockedAppWithVol,
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
      })),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeTruthy();
    });
  });

  it('renders and trigger copy mountpath in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<Containers />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedDatastoreVolume.mountPath)).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('containers-copy-mountpath-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedDatastoreVolume.mountPath,
      );
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'mountPathCopyToast',
      });
    });
  });

  it('open data sync modal on button click', async () => {
    render(<Containers />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('general-data-sync-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./data-sync');
    });
  });

  it('open data sync modal from action table button', async () => {
    render(<Containers />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedDatastoreVolume.mountPath)).toBeTruthy();
    });
    await openButtonInMenu(
      'container-action-trigger',
      'container-action-data-sync-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./data-sync/volumeId');
  });
});
