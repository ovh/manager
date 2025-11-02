import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { vitest } from 'vitest';

import { StepProps } from '@/components';
import { StepFooter } from '@/components/step/step-footer/StepFooter.component';

import { StepContext } from '../../StepContext';

vitest.mock('@ovhcloud/ods-react', () => ({
  Button: vitest.fn(({ children, variant = '', size, onClick, disabled }) => (
    <button data-testid={`button-${variant}-${size}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )),
  BUTTON_SIZE: { md: 'md' },
  BUTTON_VARIANT: { ghost: 'ghost' },
}));

describe('StepFooter Component', () => {
  const renderStepFooterWithContext = (value: Partial<StepProps>) =>
    render(
      <StepContext.Provider value={value as StepProps}>
        <StepFooter />
      </StepContext.Provider>,
    );

  it('renders the Next button when next action is provided and locked is false', () => {
    const next = { action: vitest.fn(), label: 'Next Step', disabled: false };
    renderStepFooterWithContext({ id: 'test-id', next, locked: false, skip: undefined });
    expect(screen.getByTestId('button--md')).toBeInTheDocument();
    expect(screen.getByTestId('button--md')).toHaveTextContent('Next Step');
  });

  it('does not render the Next button when locked is true', () => {
    const next = { action: vitest.fn(), label: 'Next Step', disabled: false };
    renderStepFooterWithContext({ id: 'test-id', next, locked: true, skip: undefined });
    expect(screen.queryByTestId('button--md')).not.toBeInTheDocument();
  });

  it('does not render the Next button when next action is not provided', () => {
    renderStepFooterWithContext({
      id: 'test-id',
      next: undefined,
      locked: false,
      skip: undefined,
    });
    expect(screen.queryByTestId('button--md')).not.toBeInTheDocument();
  });

  it('renders the Skip button when skip action is provided', () => {
    const skip = { action: vitest.fn(), label: 'Skip', disabled: false };
    renderStepFooterWithContext({ id: 'test-id', next: undefined, locked: false, skip });
    expect(screen.getByTestId('button-ghost-md')).toBeInTheDocument();
    expect(screen.getByTestId('button-ghost-md')).toHaveTextContent('Skip');
  });

  it('does not render the Skip button when skip action is not provided', () => {
    renderStepFooterWithContext({
      id: 'test-id',
      next: undefined,
      locked: false,
      skip: undefined,
    });
    expect(screen.queryByTestId('button-ghost-md')).not.toBeInTheDocument();
  });

  it('calls next.action when Next button is clicked and enabled', () => {
    const next = { action: vitest.fn(), label: 'Next Step', disabled: false };
    renderStepFooterWithContext({ id: 'test-id', next, locked: false, skip: undefined });
    fireEvent.click(screen.getByTestId('button--md'));
    expect(next.action).toHaveBeenCalledWith('test-id');
  });

  it('does not call next.action when Next button is disabled', () => {
    const next = { action: vitest.fn(), label: 'Next Step', disabled: true };
    renderStepFooterWithContext({ id: 'test-id', next, locked: false, skip: undefined });
    fireEvent.click(screen.getByTestId('button--md'));
    expect(next.action).not.toHaveBeenCalled();
  });

  it('calls skip.action when Skip button is clicked and enabled', () => {
    const skip = { action: vitest.fn(), label: 'Skip', disabled: false };
    renderStepFooterWithContext({ id: 'test-id', next: undefined, locked: false, skip });
    fireEvent.click(screen.getByTestId('button-ghost-md'));
    expect(skip.action).toHaveBeenCalledWith('test-id');
  });

  it('does not call skip.action when Skip button is disabled', () => {
    const skip = { action: vitest.fn(), label: 'Skip', disabled: true };
    renderStepFooterWithContext({ id: 'test-id', next: undefined, locked: false, skip });
    fireEvent.click(screen.getByTestId('button-ghost-md'));
    expect(skip.action).not.toHaveBeenCalled();
  });
});
