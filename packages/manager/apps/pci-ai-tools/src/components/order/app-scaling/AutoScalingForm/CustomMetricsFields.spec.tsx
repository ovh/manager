import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import { CustomMetricsFields } from './CustomMetricsFields';
import ai from '@/types/AI';

const TestWrapper = ({
  defaultValues,
}: {
  defaultValues?: Record<string, unknown>;
}) => {
  const methods = useForm({
    defaultValues: {
      metricUrl: '',
      dataFormat: ai.app.CustomMetricsFormatEnum.JSON,
      dataLocation: '',
      targetMetricValue: 0,
      aggregationType: ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...methods}>
      <CustomMetricsFields control={methods.control} />
    </FormProvider>
  );
};

describe('CustomMetricsFields', () => {
  it('should render all custom metrics fields', () => {
    render(<TestWrapper />);

    expect(screen.getByTestId('metric-url-input')).toBeTruthy();
    expect(screen.getByTestId('data-format-select')).toBeTruthy();
    expect(screen.getByTestId('data-location-input')).toBeTruthy();
    expect(screen.getByTestId('target-metric-value-input')).toBeTruthy();
    expect(screen.getByTestId('aggregation-type-select')).toBeTruthy();
  });

  it('should update metricUrl value', () => {
    render(<TestWrapper />);

    const input = screen.getByTestId('metric-url-input') as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: 'http://example.com/metrics' },
    });

    expect(input.value).toBe('http://example.com/metrics');
  });

  it('should update dataLocation value', () => {
    render(<TestWrapper />);

    const input = screen.getByTestId('data-location-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '$.metrics.cpu' } });

    expect(input.value).toBe('$.metrics.cpu');
  });

  it('should update targetMetricValue', () => {
    render(<TestWrapper />);

    const input = screen.getByTestId(
      'target-metric-value-input',
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '80' } });

    expect(input.value).toBe('80');
  });

  it('should have correct input attributes for targetMetricValue', () => {
    render(<TestWrapper />);

    const input = screen.getByTestId(
      'target-metric-value-input',
    ) as HTMLInputElement;

    expect(input.type).toBe('number');
    expect(input.min).toBe('');
    expect(input.step).toBe('0.5');
  });
});
