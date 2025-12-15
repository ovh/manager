import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useForm, FormProvider, Control } from 'react-hook-form';
import { ResourceTypeSelector } from './ResourceTypeSelector';
import { FullScalingFormValues } from '../scalingHelper';
import ai from '@/types/AI';

const TestWrapper = () => {
  const methods = useForm({
    defaultValues: {
      resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
    },
  });

  return (
    <FormProvider {...methods}>
      <ResourceTypeSelector />
    </FormProvider>
  );
};

describe('ResourceTypeSelector', () => {
  it('should render all resource type options', () => {
    render(<TestWrapper />);

    expect(screen.getByTestId('radio-cpu')).toBeTruthy();
    expect(screen.getByTestId('radio-ram')).toBeTruthy();
    expect(screen.getByTestId('radio-custom')).toBeTruthy();
  });

  it('should have CPU selected by default', () => {
    render(<TestWrapper />);

    const cpuRadio = screen.getByTestId('radio-cpu');
    expect(cpuRadio.getAttribute('data-state')).toBe('checked');
  });

  it('should switch to RAM when RAM radio is clicked', () => {
    render(<TestWrapper />);

    const ramRadio = screen.getByTestId('radio-ram');
    fireEvent.click(ramRadio);

    expect(ramRadio.getAttribute('data-state')).toBe('checked');
  });

  it('should switch to CUSTOM when CUSTOM radio is clicked', () => {
    render(<TestWrapper />);

    const customRadio = screen.getByTestId('radio-custom');
    fireEvent.click(customRadio);

    expect(customRadio.getAttribute('data-state')).toBe('checked');
  });
});
