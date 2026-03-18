import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import { ReplicaFields } from './ReplicaFields';

const TestWrapper = () => {
  const methods = useForm({
    defaultValues: {
      replicasMin: 1,
      replicasMax: 3,
    },
  });

  return (
    <FormProvider {...methods}>
      <ReplicaFields
        control={methods.control}
        showScaleToZeroWarning={false}
      />
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

  it('should accept numeric input', () => {
    render(<TestWrapper />);

    const minInput = screen.getByTestId('min-rep-input') as HTMLInputElement;
    fireEvent.change(minInput, { target: { value: '5' } });

    expect(minInput.value).toBe('5');
  });
});
