import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { CpuRamFields } from './CpuRamFields';
import { ScalingFormValues } from '@/lib/scalingHelper';

const TestWrapper = ({ onFieldChange }: { onFieldChange: () => void }) => {
  const methods = useForm<ScalingFormValues>({
    defaultValues: {
      averageUsage: 75,
    },
  });

  return (
    <FormProvider {...methods}>
      <CpuRamFields control={methods.control} onFieldChange={onFieldChange} />
    </FormProvider>
  );
};

describe('CpuRamFields', () => {
  it('should render the average usage slider', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    expect(screen.getByTestId('resource-usage-slider')).toBeTruthy();
    expect(screen.getByTestId('storage-unit-value-container')).toBeTruthy();
  });

  it('should display the current value', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    const valueContainer = screen.getByTestId('storage-unit-value-container');
    expect(valueContainer.textContent).toBe('75 %');
  });

  it('should display min and max labels', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.getByText('100')).toBeTruthy();
  });

  it('should have correct slider id', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    const slider = screen.getByTestId('resource-usage-slider');
    expect(slider.getAttribute('id')).toBe('resource-usage-select');
  });
});
