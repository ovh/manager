import React from 'react';

import { render, screen } from '@testing-library/react';
import { expect, it, vitest } from 'vitest';

import { StepProps } from '@/components';
import { StepIndicator } from '@/components/step/step-indicator/StepIndicator.component';

import { StepContext } from '../../StepContext';

vitest.mock('@ovhcloud/ods-react', () => ({
  Icon: vitest.fn(({ name, className }) => (
    <div data-testid="icon" className={className}>
      {name}
    </div>
  )),
  ICON_NAME: { check: 'check' },
  clsx: vitest.fn((...args) => args.join(' ')),
}));

describe('StepIndicator Component', () => {
  const renderStepIndicatorWithContext = (value: Partial<StepProps>) =>
    render(
      <StepContext.Provider value={value as StepProps}>
        <StepIndicator />
      </StepContext.Provider>,
    );

  it('renders the Icon component when checked is true', () => {
    renderStepIndicatorWithContext({ checked: true, open: false, order: 1 });
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('check');
    expect(icon).toHaveClass('block p-[12px] text-[20px] text-(--ods-color-primary-500)');
  });

  it('renders the Order element when checked is false and open is false', () => {
    renderStepIndicatorWithContext({ checked: false, open: false, order: 1 });
    const span = screen.getByText(/1/i);
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass('border-(--ods-color-neutral-500) text-(--ods-color-neutral-500)');
  });

  it('renders the Order element with primary color when checked is false and open is true', () => {
    renderStepIndicatorWithContext({ checked: false, open: true, order: 1 });
    const span = screen.getByText(/1/i);
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass('border-(--ods-color-primary-500) text-(--ods-color-text)');
  });
});
