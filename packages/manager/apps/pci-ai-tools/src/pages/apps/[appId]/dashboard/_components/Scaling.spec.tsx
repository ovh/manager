import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedApp, mockedAppSpec } from '@/__tests__/helpers/mocks/app/app';
import ScalingStrat from './Scaling.component';
import { useAppData } from '@/pages/apps/[appId]/App.context';
import { AIError } from '@/data/api';

const autoScalingApp: ai.app.App = {
  ...mockedApp,
  spec: {
    ...mockedAppSpec,
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

describe('Scaling component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();

    vi.mock('@/pages/apps/[appId]/App.context', () => ({
      useAppData: vi.fn(() => ({
        projectId: 'projectId',
        app: mockedApp,
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
      })),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders GeneralInformation', async () => {
    render(<ScalingStrat />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-scaling-button')).toBeTruthy();
    expect(screen.getByTestId('fixed-list')).toBeTruthy();
  });

  it('open update scaling modal', async () => {
    render(<ScalingStrat />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('update-scaling-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./update-scaling');
    });
  });

  it('renders GeneralInformation with autoScaling', async () => {
    vi.mocked(useAppData).mockReturnValue({
      projectId: 'projectId',
      app: autoScalingApp,
      appQuery: {} as UseQueryResult<ai.app.App, AIError>,
    });
    render(<ScalingStrat />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-scaling-button')).toBeTruthy();
    expect(screen.getByTestId('automatic-list')).toBeTruthy();
  });
});
