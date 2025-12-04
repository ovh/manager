import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { ReplicaFields } from './ReplicaFields';
import { ScalingFormValues } from '@/lib/scalingHelper';

const TestWrapper = ({ onFieldChange }: { onFieldChange: () => void }) => {
  const methods = useForm<ScalingFormValues>({
    defaultValues: {
      minRep: 1,
      maxRep: 3,
    },
  });

  return (
    <FormProvider {...methods}>
      <ReplicaFields control={methods.control} onFieldChange={onFieldChange} />
    </FormProvider>
  );
};

describe('ReplicaFields', () => {
  it('should render min and max replica fields', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    expect(screen.getByTestId('min-rep-input')).toBeTruthy();
    expect(screen.getByTestId('max-rep-input')).toBeTruthy();
  });

  it('should call onFieldChange when min replicas changes', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    const minInput = screen.getByTestId('min-rep-input');
    fireEvent.change(minInput, { target: { value: '2' } });

    expect(onFieldChange).toHaveBeenCalled();
  });

  it('should call onFieldChange when max replicas changes', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    const maxInput = screen.getByTestId('max-rep-input');
    fireEvent.change(maxInput, { target: { value: '5' } });

    expect(onFieldChange).toHaveBeenCalled();
  });

  it('should accept numeric input within range', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    const minInput = screen.getByTestId('min-rep-input') as HTMLInputElement;
    fireEvent.change(minInput, { target: { value: '50' } });

    expect(minInput.value).toBe('50');
  });
});
