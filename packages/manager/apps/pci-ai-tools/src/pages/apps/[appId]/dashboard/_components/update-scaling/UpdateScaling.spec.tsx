import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { UseQueryResult } from '@tanstack/react-query';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as scalingApi from '@/data/api/ai/app/scaling-strategy/scaling-strategy.api';
import {
  mockedApp,
  mockedAppAutoScalingGPU,
} from '@/__tests__/helpers/mocks/app/app';
import ai from '@/types/AI';
import UpdateScaling from './UpdateScaling.modal';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog/catalog';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { useAppData } from '../../../App.context';
import { AIError } from '@/data/api';

describe('Data Sync Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();

    vi.mock('@/pages/apps/[appId]/App.context', () => ({
      useAppData: vi.fn(() => ({
        projectId: 'projectId',
        app: mockedApp,
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/app/scaling-strategy/scaling-strategy.api', () => ({
      scalingStrategy: vi.fn(() => mockedAppAutoScalingGPU),
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
    expect(screen.getByTestId('dialog-container')).toBeTruthy();
  });

  it('renders UpdateSclaling modal and trigger onError on API Error', async () => {
    vi.mocked(scalingApi.scalingStrategy).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<UpdateScaling />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-scaling-modal')).toBeTruthy();
    expect(screen.getByTestId('replicas-input')).toBeTruthy();
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
    expect(screen.getByTestId('update-scaling-modal')).toBeTruthy();
    expect(screen.getByTestId('replicas-input')).toBeTruthy();
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
      app: mockedAppAutoScalingGPU,
      appQuery: {} as UseQueryResult<ai.app.App, AIError>,
    });
    render(<UpdateScaling />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-scaling-modal')).toBeTruthy();
    expect(screen.getByTestId('max-rep-input')).toBeTruthy();
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
