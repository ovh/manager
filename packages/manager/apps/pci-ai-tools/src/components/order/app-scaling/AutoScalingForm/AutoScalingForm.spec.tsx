import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import { useForm, FormProvider, Control } from 'react-hook-form';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { AutoScalingForm } from './AutoScalingForm.component';
import { mockedAppPricing1 } from '@/__tests__/helpers/mocks/app/appHelper';
import { FullScalingFormValues, ResourceType } from '../scalingHelper';
import ai from '@/types/AI';

describe('AutoScalingForm component', () => {
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
    resourceType = ai.app.ScalingAutomaticStrategyResourceTypeEnum
      .CPU as ResourceType,
    replicasMin = 1,
  }: {
    resourceType?: ResourceType;
    replicasMin?: number;
  }) => {
    const methods = useForm({
      defaultValues: {
        replicasMin,
        replicasMax: 5,
        cooldownPeriodSeconds: 300,
        scaleUpStabilizationWindowSeconds: 0,
        scaleDownStabilizationWindowSeconds: 300,
        resourceType,
        averageUsageTarget: 75,
        metricUrl: '',
        dataFormat: ai.app.CustomMetricsFormatEnum.JSON,
        dataLocation: '',
        targetMetricValue: 0,
        aggregationType: ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
      },
    });

    return (
      <FormProvider {...methods}>
        <AutoScalingForm pricingFlavor={mockedAppPricing1} />
      </FormProvider>
    );
  };

  it('should render AutoScalingForm with CPU/RAM fields', async () => {
    render(<TestWrapper />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
      expect(screen.getByTestId('min-rep-input')).toBeTruthy();
      expect(screen.getByTestId('max-rep-input')).toBeTruthy();
      expect(screen.getByTestId('scale-up-delay-input')).toBeTruthy();
      expect(screen.getByTestId('scale-down-delay-input')).toBeTruthy();
      expect(screen.getByTestId('resource-usage-slider')).toBeTruthy();
    });
  });

  it('should render AutoScalingForm with CUSTOM fields', async () => {
    render(<TestWrapper resourceType={ResourceType.CUSTOM} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
      expect(screen.getByTestId('min-rep-input')).toBeTruthy();
      expect(screen.getByTestId('max-rep-input')).toBeTruthy();
      expect(screen.getByTestId('metric-url-input')).toBeTruthy();
      expect(screen.getByTestId('data-format-select')).toBeTruthy();
      expect(screen.getByTestId('data-location-input')).toBeTruthy();
      expect(screen.getByTestId('target-metric-value-input')).toBeTruthy();
      expect(screen.getByTestId('aggregation-type-select')).toBeTruthy();
    });
  });

  it('should render scale-to-zero fields when minimum replicas is 0', async () => {
    render(<TestWrapper replicasMin={0} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('scale-to-zero-input')).toBeTruthy();
    });
  });
});
