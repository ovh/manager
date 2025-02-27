import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as scalingApi from '@/data/api/ai/app/scaling-strategy/scaling-strategy.api';
import { mockedApp, mockedAppSpec } from '@/__tests__/helpers/mocks/app';
import * as ai from '@/types/cloud/project/ai';
import UpdateScaling from './UpdateScaling.modal';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';
import { useAppData } from '../../../App.context';
import { mockedResources } from '@/__tests__/helpers/mocks/notebook';
import { AIError } from '@/data/api';

const appWithCatalogFlavor: ai.app.App = {
  ...mockedApp,
  spec: {
    ...mockedAppSpec,
    resources: {
      ...mockedResources,
      flavor: 'flavorCPUId',
    },
  },
};

const appWithCatalogFlavorAutoScaling: ai.app.App = {
  ...mockedApp,
  spec: {
    ...mockedAppSpec,
    resources: {
      ...mockedResources,
      flavor: 'flavorCPUId',
    },
    scalingStrategy: {
      automatic: {
        averageUsageTarget: 75,
        replicasMin: 2,
        replicasMax: 3,
        resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
      },
    },
  },
};

describe('Data Sync Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();

    vi.mock('@/pages/apps/[appId]/App.context', () => ({
      useAppData: vi.fn(() => ({
        projectId: 'projectId',
        app: appWithCatalogFlavor,
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/app/scaling-strategy/scaling-strategy.api', () => ({
      scalingStrategy: vi.fn(() => appWithCatalogFlavor),
    }));

    vi.mock('@/data/api/catalog/catalog.api', () => ({
      catalogApi: {
        getCatalog: vi.fn(() => mockedCatalog),
      },
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton while loading', async () => {
    render(<UpdateScaling />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
  });

  it('renders UpdateSclaling modal and trigger onError on API Error', async () => {
    vi.mocked(scalingApi.scalingStrategy).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<UpdateScaling />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-scaling-modal')).toBeInTheDocument();
    expect(screen.getByTestId('replicas-input')).toBeInTheDocument();
    act(() => {
      fireEvent.change(screen.getByTestId('replicas-input'), {
        target: {
          value: 6,
        },
      });
      fireEvent.click(screen.getByTestId('update-scaling-submit-button'));
    });
    await waitFor(() => {
      expect(scalingApi.scalingStrategy).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateScalingStratToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger onSuccess on summit click', async () => {
    render(<UpdateScaling />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-scaling-modal')).toBeInTheDocument();
    expect(screen.getByTestId('replicas-input')).toBeInTheDocument();
    act(() => {
      fireEvent.change(screen.getByTestId('replicas-input'), {
        target: {
          value: 6,
        },
      });
      fireEvent.click(screen.getByTestId('update-scaling-submit-button'));
    });
    await waitFor(() => {
      expect(scalingApi.scalingStrategy).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateScalingStratToastSuccessTitle',
        description: 'updateScalingStratToastSuccessDescription',
      });
    });
  });

  it('trigger onSuccess on summit click for automatic scaling', async () => {
    vi.mocked(useAppData).mockReturnValue({
      projectId: 'projectId',
      app: appWithCatalogFlavorAutoScaling,
      appQuery: {} as UseQueryResult<ai.app.App, AIError>,
    });
    render(<UpdateScaling />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-scaling-modal')).toBeInTheDocument();
    expect(screen.getByTestId('max-rep-input')).toBeInTheDocument();
    act(() => {
      fireEvent.change(screen.getByTestId('max-rep-input'), {
        target: {
          value: 6,
        },
      });
      fireEvent.click(screen.getByTestId('update-scaling-submit-button'));
    });
    await waitFor(() => {
      expect(scalingApi.scalingStrategy).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateScalingStratToastSuccessTitle',
        description: 'updateScalingStratToastSuccessDescription',
      });
    });
  });
});
