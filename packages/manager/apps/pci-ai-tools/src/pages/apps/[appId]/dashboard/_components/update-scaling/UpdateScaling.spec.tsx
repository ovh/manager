import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { type ReactNode } from 'react';
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
import { useGetCatalog } from '@/data/hooks/catalog/useGetCatalog.hook';

const toastSpy = vi.fn();
const mockedNavigate = vi.fn();

vi.mock('@datatr-ux/uxlib', async () => {
  const actual = await vi.importActual<typeof import('@datatr-ux/uxlib')>(
    '@datatr-ux/uxlib',
  );

  return {
    ...actual,
    useToast: () => ({ toast: toastSpy }),
    Dialog: ({
      children,
      defaultOpen: _defaultOpen,
      onOpenChange: _onOpenChange,
      ...props
    }: {
      children: ReactNode;
      defaultOpen?: boolean;
      onOpenChange?: (...args: unknown[]) => void;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    DialogContent: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    DialogDescription: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => (
      <div {...props}>{children}</div>
    ),
    DialogFooter: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => (
      <div {...props}>{children}</div>
    ),
    DialogHeader: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => (
      <div {...props}>{children}</div>
    ),
    DialogTitle: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    DialogClose: ({
      children,
      asChild: _asChild,
      ...props
    }: { children: ReactNode; asChild?: boolean } & Record<string, unknown>) => (
      <div {...props}>{children}</div>
    ),
    ScrollArea: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    ScrollBar: (): null => null,
    Skeleton: ({
      className,
      ...props
    }: {
      className?: string;
      [key: string]: unknown;
    }) => (
      <div className={className} {...props} />
    ),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  );

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('@/components/order/app-scaling/ScalingStrategy.component', async () => {
  const { useFormContext } = await vi.importActual<
    typeof import('react-hook-form')
  >('react-hook-form');

  return {
    default: () => {
      const { register } = useFormContext();

      return (
        <div data-testid="mocked-scaling-strategy">
          <input
            data-testid="replicas-input"
            type="number"
            {...register('replicas', { valueAsNumber: true })}
          />
          <input
            data-testid="min-rep-input"
            type="number"
            {...register('replicasMin', { valueAsNumber: true })}
          />
          <input
            data-testid="max-rep-input"
            type="number"
            {...register('replicasMax', { valueAsNumber: true })}
          />
          <input
            data-testid="average-usage-target-input"
            type="number"
            {...register('averageUsageTarget', { valueAsNumber: true })}
          />
          <input data-testid="resource-type-input" {...register('resourceType')} />
          <input
            data-testid="cooldown-period-seconds-input"
            type="number"
            {...register('cooldownPeriodSeconds', { valueAsNumber: true })}
          />
          <input
            data-testid="scale-up-stabilization-window-seconds-input"
            type="number"
            {...register('scaleUpStabilizationWindowSeconds', {
              valueAsNumber: true,
            })}
          />
          <input
            data-testid="scale-down-stabilization-window-seconds-input"
            type="number"
            {...register('scaleDownStabilizationWindowSeconds', {
              valueAsNumber: true,
            })}
          />
        </div>
      );
    },
  };
});

vi.mock('@/data/hooks/catalog/useGetCatalog.hook', () => ({
  useGetCatalog: vi.fn(),
}));

describe('Data Sync Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    toastSpy.mockReset();
    mockedNavigate.mockReset();
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

    vi.mocked(useGetCatalog).mockReturnValue({
      isSuccess: true,
      data: mockedCatalog,
    } as ReturnType<typeof useGetCatalog>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton while loading', async () => {
    vi.mocked(useGetCatalog).mockReturnValue({
      isSuccess: false,
    } as ReturnType<typeof useGetCatalog>);
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
      expect(toastSpy).toHaveBeenCalledWith({
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
      expect(toastSpy).toHaveBeenCalledWith({
        title: 'updateScalingStratToastSuccessTitle',
        description: 'updateScalingStratToastSuccessDescription',
      });
    });
  });

  it('trigger onSuccess on summit click for automatic scaling', async () => {
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
      expect(toastSpy).toHaveBeenCalledWith({
        title: 'updateScalingStratToastSuccessTitle',
        description: 'updateScalingStratToastSuccessDescription',
      });
    });
  });
});
