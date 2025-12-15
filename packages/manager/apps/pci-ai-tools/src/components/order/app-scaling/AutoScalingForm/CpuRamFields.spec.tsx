import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useForm, FormProvider, Control } from 'react-hook-form';
import { CpuRamFields } from './CpuRamFields';
import { FullScalingFormValues } from '../scalingHelper';

const TestWrapper = ({ defaultValue = 75 }: { defaultValue?: number }) => {
  const methods = useForm({
    defaultValues: {
      averageUsageTarget: defaultValue,
    },
  });

  return (
    <FormProvider {...methods}>
      <CpuRamFields />
    </FormProvider>
  );
};

describe('CpuRamFields', () => {
  it('should render the average usage slider', () => {
    render(<TestWrapper />);

    expect(screen.getByTestId('resource-usage-slider')).toBeTruthy();
    expect(screen.getByTestId('storage-unit-value-container')).toBeTruthy();
  });

  it('should display the current value', () => {
    render(<TestWrapper defaultValue={75} />);

    const valueContainer = screen.getByTestId('storage-unit-value-container');
    expect(valueContainer.textContent).toBe('75 %');
  });

  it('should display min and max labels', () => {
    render(<TestWrapper />);

    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.getByText('100')).toBeTruthy();
  });

  it('should have correct slider id', () => {
    render(<TestWrapper />);

    const slider = screen.getByTestId('resource-usage-slider');
    expect(slider.getAttribute('id')).toBe('resource-usage-select');
  });

  it('should display custom value', () => {
    render(<TestWrapper defaultValue={42} />);

    const valueContainer = screen.getByTestId('storage-unit-value-container');
    expect(valueContainer.textContent).toBe('42 %');
  });
});
