import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { ResourceTypeSelector } from './ResourceTypeSelector';
import { ScalingFormValues } from '@/lib/scalingHelper';
import ai from '@/types/AI';

const TestWrapper = ({ onFieldChange }: { onFieldChange: () => void }) => {
  const methods = useForm<ScalingFormValues>({
    defaultValues: {
      resType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
    },
  });

  return (
    <FormProvider {...methods}>
      <ResourceTypeSelector
        control={methods.control}
        setValue={methods.setValue}
        onFieldChange={onFieldChange}
      />
    </FormProvider>
  );
};

describe('ResourceTypeSelector', () => {
  it('should render all resource type options', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    expect(screen.getByTestId('radio-cpu')).toBeTruthy();
    expect(screen.getByTestId('radio-ram')).toBeTruthy();
    expect(screen.getByTestId('radio-custom')).toBeTruthy();
  });

  it('should call onFieldChange when RAM is selected', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    const ramRadio = screen.getByTestId('radio-ram');
    fireEvent.click(ramRadio);

    expect(onFieldChange).toHaveBeenCalled();
  });

  it('should call onFieldChange when CUSTOM is selected', () => {
    const onFieldChange = vi.fn();
    render(<TestWrapper onFieldChange={onFieldChange} />);

    const customRadio = screen.getByTestId('radio-custom');
    fireEvent.click(customRadio);

    expect(onFieldChange).toHaveBeenCalled();
  });
});
