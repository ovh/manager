import React from 'react';
import { render, screen } from '@testing-library/react';
import { vitest, expect, it } from 'vitest';
import StepIndicator from '../StepIndicator.component';
import { StepContext } from '../../StepContext';

// Mocking Icon component to avoid rendering real icon
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
  const renderWithStepContext = (value) =>
    render(
      <StepContext.Provider value={value}>
        <StepIndicator />
      </StepContext.Provider>,
    );

  it('renders the Icon component when checked is true', () => {
    renderWithStepContext({ checked: true, open: false, order: 1 });
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('check');
    expect(icon).toHaveClass(
      'block p-[12px] text-[20px] text-[--ods-color-primary-500]',
    );
  });

  it('renders the Order element when checked is false and open is false', () => {
    renderWithStepContext({ checked: false, open: false, order: 1 });
    const span = screen.getByText(/1/i);
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass(
      'border-[--ods-color-neutral-500] text-[--ods-color-neutral-500]',
    );
  });

  it('renders the Order element with primary color when checked is false and open is true', () => {
    renderWithStepContext({ checked: false, open: true, order: 1 });
    const span = screen.getByText(/1/i);
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass(
      'border-[--ods-color-primary-500] text-[--ods-color-text]',
    );
  });
});
