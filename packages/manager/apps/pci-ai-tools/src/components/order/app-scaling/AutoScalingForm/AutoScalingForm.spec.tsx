import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { AutoScalingForm } from './AutoScalingForm.component';
import { mockedAppPricing1 } from '@/__tests__/helpers/mocks/app/appHelper';
import { ResourceType } from '../scalingHelper';
import ai from '@/types/AI';

describe('AutoScalingForm component', () => {
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

  it('should render AutoScalingForm with CPU/RAM fields', () => {
    render(<TestWrapper />);

    expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
    expect(screen.getByTestId('min-rep-input')).toBeTruthy();
    expect(screen.getByTestId('max-rep-input')).toBeTruthy();
    expect(screen.getByTestId('scale-up-delay-input')).toBeTruthy();
    expect(screen.getByTestId('scale-down-delay-input')).toBeTruthy();
    expect(screen.getByTestId('resource-usage-slider')).toBeTruthy();
  });

  it('should render AutoScalingForm with CUSTOM fields', () => {
    render(<TestWrapper resourceType={ResourceType.CUSTOM} />);

    expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
    expect(screen.getByTestId('min-rep-input')).toBeTruthy();
    expect(screen.getByTestId('max-rep-input')).toBeTruthy();
    expect(screen.getByTestId('metric-url-input')).toBeTruthy();
    expect(screen.getByTestId('data-format-select')).toBeTruthy();
    expect(screen.getByTestId('data-location-input')).toBeTruthy();
    expect(screen.getByTestId('target-metric-value-input')).toBeTruthy();
    expect(screen.getByTestId('aggregation-type-select')).toBeTruthy();
  });

  it('should render scale-to-zero fields when minimum replicas is 0', () => {
    render(<TestWrapper replicasMin={0} />);

    expect(screen.getByTestId('scale-to-zero-input')).toBeTruthy();
  });
});
