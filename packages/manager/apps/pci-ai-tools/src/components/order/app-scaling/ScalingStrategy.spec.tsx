import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import ScalingStrategy from './ScalingStrategy.component';
import { mockedAppPricing1 } from '@/__tests__/helpers/mocks/app/appHelper';
import ai from '@/types/AI';

describe('Scaling strategy component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
    vi.mock('@/data/hooks/catalog/useGetCatalog.hook', () => {
      return {
        useGetCatalog: vi.fn(() => ({
          isSuccess: true,
          data: {
            locale: {
              currencyCode: 'EUR',
            },
          },
        })),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const TestWrapper = ({
    autoScaling = false,
    replicas = 1,
  }: {
    autoScaling?: boolean;
    replicas?: number;
  }) => {
    const form = useForm({
      defaultValues: {
        autoScaling,
        replicas,
        replicasMin: 1,
        replicasMax: 1,
        cooldownPeriodSeconds: 300,
        scaleUpStabilizationWindowSeconds: 0,
        scaleDownStabilizationWindowSeconds: 300,
        resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
        averageUsageTarget: 75,
        metricUrl: '',
        dataFormat: ai.app.CustomMetricsFormatEnum.JSON,
        dataLocation: '',
        targetMetricValue: 0,
        aggregationType: ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
      },
    });

    return (
      <FormProvider {...form}>
        <ScalingStrategy pricingFlavor={mockedAppPricing1} />
      </FormProvider>
    );
  };

  it('should display Autoscaling form with value', async () => {
    render(<TestWrapper autoScaling={true} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('scaling-strat-container')).toBeTruthy();
      expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
    });
  });

  it('should display Fixed scaling on switch click', async () => {
    render(<TestWrapper autoScaling={true} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('scaling-strat-container')).toBeTruthy();
      expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('switch-scaling-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('fixed-scaling-container')).toBeTruthy();
    });
  });

  it('should display fixed scaling form', async () => {
    render(<TestWrapper autoScaling={false} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('fixed-scaling-container')).toBeTruthy();
      expect(screen.getByTestId('replicas-input')).toBeTruthy();
    });
  });
});
