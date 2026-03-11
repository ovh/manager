import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { useAppData } from '../../../App.context';
import { AIError } from '@/data/api';

describe('UpdateScaling', () => {
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
      scalingStrategy: vi.fn(() => Promise.resolve(mockedAppAutoScalingGPU)),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders update scaling modal', async () => {
    render(<UpdateScaling />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-scaling-modal')).toBeTruthy();
  });

  it('renders the modal and triggers onError on API error', async () => {
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
    });

    await waitFor(() => {
      const submitButton = screen.getByTestId('update-scaling-submit-button');
      expect(submitButton).toBeTruthy();
    });

    act(() => {
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

  it('triggers onSuccess on submit click', async () => {
    render(<UpdateScaling />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-scaling-modal')).toBeTruthy();
    expect(screen.getByTestId('replicas-input')).toBeTruthy();

    act(() => {
      fireEvent.change(screen.getByTestId('replicas-input'), {
        target: {
          value: 6,
        },
      });
    });

    await waitFor(() => {
      const submitButton = screen.getByTestId('update-scaling-submit-button');
      expect(submitButton).toBeTruthy();
    });

    act(() => {
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

  it('triggers onSuccess on submit click for automatic scaling', async () => {
    const appAutoScaling = {
      ...mockedAppAutoScalingGPU,
      spec: {
        ...mockedAppAutoScalingGPU.spec,
        scalingStrategy: {
          automatic: {
            ...mockedAppAutoScalingGPU.spec.scalingStrategy?.automatic,
            replicasMin: 2,
            replicasMax: 6,
          },
        },
      },
    };

    vi.mocked(useAppData).mockReturnValue({
      projectId: 'projectId',
      app: appAutoScaling,
      appQuery: {} as UseQueryResult<ai.app.App, AIError>,
    });
    render(<UpdateScaling />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('update-scaling-modal')).toBeTruthy();
      expect(screen.getByTestId('max-rep-input')).toBeTruthy();
    });

    await waitFor(() => {
      const submitButton = screen.getByTestId('update-scaling-submit-button');
      expect(submitButton).toBeTruthy();
    });

    act(() => {
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
