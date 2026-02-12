import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
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
      <CustomMetricsFields />
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

  // Note: Error messages are now displayed only on form submission (mode: 'onSubmit')
  // These tests have been removed as they checked for automatic error display
  // The validation now happens when the user submits the form

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
    fireEvent.input(input, { target: { value: '80' } });

    expect(input.value).toBe('80');
  });

  it('should have correct input attributes for targetMetricValue', () => {
    render(<TestWrapper />);

    const input = screen.getByTestId(
      'target-metric-value-input',
    ) as HTMLInputElement;

    expect(input).toHaveAttribute('role', 'spinbutton');
    expect(input).toHaveAttribute('inputmode', 'decimal');
    expect(input).toHaveAttribute('aria-valuemin', '0');
  });
});
