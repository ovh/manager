import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AppLayout, {
  breadcrumb as Breadcrumb,
  Loader,
} from '@/pages/apps/[appId]/App.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as appAPI from '@/data/api/ai/app/app.api';
import ai from '@/types/AI';
import {
  mockedDatastoreVolume,
  mockedPublicGitVolume,
} from '@/__tests__/helpers/mocks/volume/volume';
import {
  mockedApp,
  mockedAppSpec,
  mockedAppStatus,
} from '@/__tests__/helpers/mocks/app/app';

const loaderParam = {
  params: {
    projectId: 'projectId',
    appId: 'appId',
  },
  request: new Request('https://my-api.com/endpoint'),
};

const mockedAppWithVol: ai.app.App = {
  ...mockedApp,
  spec: {
    ...mockedAppSpec,
    volumes: [mockedDatastoreVolume, mockedPublicGitVolume],
    unsecureHttp: true,
    name: 'appName',
  },
  status: {
    ...mockedAppStatus,
    state: ai.app.AppStateEnum.INITIALIZING,
  },
};

describe('App Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          appId: 'appId',
        }),
      };
    });

    vi.mock('@/data/api/ai/app/app.api', () => ({
      getApp: vi.fn(() => mockedApp),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader function', async () => {
    Loader(loaderParam);
    await waitFor(() => {
      expect(appAPI.getApp).toHaveBeenCalled();
    });
  });

  it('renders skeleton of app Layout', async () => {
    render(<AppLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('dashboardTab')).toBeTruthy();
    });
  });

  it('renders breadcrumb', async () => {
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedApp.spec.name)).toBeTruthy();
    });
  });

  it('renders fully service layout', async () => {
    vi.mocked(appAPI.getApp).mockImplementationOnce(async () => {
      return mockedApp;
    });
    render(<AppLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('app-header-container')).toBeTruthy();
    });
    expect(screen.getByText(mockedApp.spec.name)).toBeTruthy();
  });

  it('renders fully service layout', async () => {
    vi.mocked(appAPI.getApp).mockImplementationOnce(async () => {
      return mockedAppWithVol;
    });
    render(<AppLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('app-header-container')).toBeTruthy();
      expect(screen.getByText(mockedAppWithVol.spec.name)).toBeTruthy();
    });
  });
});
