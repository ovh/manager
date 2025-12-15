import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useForm, FormProvider, Control } from 'react-hook-form';
import { ReplicaFields } from './ReplicaFields';
import { FullScalingFormValues } from '../scalingHelper';

const TestWrapper = () => {
  const methods = useForm({
    defaultValues: {
      replicasMin: 1,
      replicasMax: 3,
    },
  });

  return (
    <FormProvider {...methods}>
      <ReplicaFields />
    </FormProvider>
  );
};

describe('ReplicaFields', () => {
  it('should render min and max replica fields', () => {
    render(<TestWrapper />);

    expect(screen.getByTestId('min-rep-input')).toBeTruthy();
    expect(screen.getByTestId('max-rep-input')).toBeTruthy();
  });

  it('should display correct initial values', () => {
    render(<TestWrapper />);

    const minInput = screen.getByTestId('min-rep-input') as HTMLInputElement;
    const maxInput = screen.getByTestId('max-rep-input') as HTMLInputElement;

    expect(minInput.value).toBe('1');
    expect(maxInput.value).toBe('3');
  });

  it('should accept numeric input within range', () => {
    render(<TestWrapper />);

    const minInput = screen.getByTestId('min-rep-input') as HTMLInputElement;
    fireEvent.change(minInput, { target: { value: '50' } });

    expect(minInput.value).toBe('50');
  });
});
