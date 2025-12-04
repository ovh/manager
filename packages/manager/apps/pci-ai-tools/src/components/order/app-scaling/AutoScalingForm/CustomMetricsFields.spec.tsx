import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { CustomMetricsFields } from './CustomMetricsFields';
import { ScalingFormValues } from '@/lib/scalingHelper';
import ai from '@/types/AI';

const TestWrapper = ({
  onFieldChange,
  defaultValues,
}: {
  onFieldChange: () => void;
  defaultValues?: Partial<ScalingFormValues>;
}) => {
  const methods = useForm<ScalingFormValues>({
    defaultValues: {
      metricUrl: '',
      dataFormat: ai.app.CustomMetricsFormatEnum.JSON,
      dataLocation: '',
      targetMetricValue: undefined,
      aggregationType: ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...methods}>
      <CustomMetricsFields
        control={methods.control}
        onFieldChange={onFieldChange}
      />
    </FormProvider>
  );
};

describe('CustomMetricsFields', () => {
  it('should render all custom metrics fields', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    expect(screen.getByTestId('metric-url-input')).toBeTruthy();
    expect(screen.getByTestId('data-format-select')).toBeTruthy();
    expect(screen.getByTestId('data-location-input')).toBeTruthy();
    expect(screen.getByTestId('target-metric-value-input')).toBeTruthy();
    expect(screen.getByTestId('aggregation-type-select')).toBeTruthy();
  });

  it('should display error message when metricUrl is empty', async () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/metricUrlRequired/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it('should display error message when dataLocation is empty', async () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/dataLocationRequired/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it('should call onFieldChange when metricUrl changes', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    const input = screen.getByTestId('metric-url-input');
    fireEvent.change(input, { target: { value: 'http://example.com/metrics' } });

    expect(onFieldChange).toHaveBeenCalled();
  });

  it('should call onFieldChange when dataLocation changes', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    const input = screen.getByTestId('data-location-input');
    fireEvent.change(input, { target: { value: '$.metrics.cpu' } });

    expect(onFieldChange).toHaveBeenCalled();
  });

  it('should call onFieldChange when targetMetricValue changes', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    const input = screen.getByTestId('target-metric-value-input');
    fireEvent.change(input, { target: { value: '80' } });

    expect(onFieldChange).toHaveBeenCalled();
  });

  it('should not display error when metricUrl has valid value', () => {
    const onFieldChange = vi.fn();
    render(
      <TestWrapper
        onFieldChange={onFieldChange}
        defaultValues={{ metricUrl: 'http://example.com' }}
      />,
    );

    const errorMessages = screen.queryAllByText(/metricUrlRequired/i);
    expect(errorMessages.length).toBe(0);
  });

  it('should not display error when dataLocation has valid value', () => {
    const onFieldChange = vi.fn();
    render(
      <TestWrapper
        onFieldChange={onFieldChange}
        defaultValues={{ dataLocation: '$.data' }}
      />,
    );

    const errorMessages = screen.queryAllByText(/dataLocationRequired/i);
    expect(errorMessages.length).toBe(0);
  });

  it('should have correct input attributes for targetMetricValue', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    const input = screen.getByTestId(
      'target-metric-value-input',
    ) as HTMLInputElement;

    expect(input.type).toBe('number');
    expect(input.min).toBe('0');
    expect(input.step).toBe('0.5');
  });
});
