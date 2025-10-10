import React from 'react';
import { vitest } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StepFooter from '../StepFooter.component';
import { StepContext } from '../../StepContext';

// Mocking Button component to easily test different variants and size without depending on ODS
vitest.mock('@ovhcloud/ods-react', () => ({
  Button: vitest.fn(({ children, variant = '', size, onClick, disabled }) => (
    <button
      data-testid={`button-${variant}-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )),
  BUTTON_SIZE: { md: 'md' },
  BUTTON_VARIANT: { ghost: 'ghost' },
}));

describe('StepFooter Component', () => {
  const renderWithStepContext = (value) =>
    render(
      <StepContext.Provider value={value}>
        <StepFooter />
      </StepContext.Provider>,
    );

  it('renders the Next button when next action is provided and locked is false', () => {
    const next = { action: vitest.fn(), label: 'Next Step', disabled: false };
    renderWithStepContext({ id: 'test-id', next, locked: false, skip: null });
    expect(screen.getByTestId('button--md')).toBeInTheDocument();
    expect(screen.getByTestId('button--md')).toHaveTextContent('Next Step');
  });

  it('does not render the Next button when locked is true', () => {
    const next = { action: vitest.fn(), label: 'Next Step', disabled: false };
    renderWithStepContext({ id: 'test-id', next, locked: true, skip: null });
    expect(screen.queryByTestId('button--md')).not.toBeInTheDocument();
  });

  it('does not render the Next button when next action is not provided', () => {
    renderWithStepContext({
      id: 'test-id',
      next: null,
      locked: false,
      skip: null,
    });
    expect(screen.queryByTestId('button--md')).not.toBeInTheDocument();
  });

  it('renders the Skip button when skip action is provided', () => {
    const skip = { action: vitest.fn(), label: 'Skip', disabled: false };
    renderWithStepContext({ id: 'test-id', next: null, locked: false, skip });
    expect(screen.getByTestId('button-ghost-md')).toBeInTheDocument();
    expect(screen.getByTestId('button-ghost-md')).toHaveTextContent('Skip');
  });

  it('does not render the Skip button when skip action is not provided', () => {
    renderWithStepContext({
      id: 'test-id',
      next: null,
      locked: false,
      skip: null,
    });
    expect(screen.queryByTestId('button-ghost-md')).not.toBeInTheDocument();
  });

  it('calls next.action when Next button is clicked and enabled', () => {
    const next = { action: vitest.fn(), label: 'Next Step', disabled: false };
    renderWithStepContext({ id: 'test-id', next, locked: false, skip: null });
    fireEvent.click(screen.getByTestId('button--md'));
    expect(next.action).toHaveBeenCalledWith('test-id');
  });

  it('does not call next.action when Next button is disabled', () => {
    const next = { action: vitest.fn(), label: 'Next Step', disabled: true };
    renderWithStepContext({ id: 'test-id', next, locked: false, skip: null });
    fireEvent.click(screen.getByTestId('button--md'));
    expect(next.action).not.toHaveBeenCalled();
  });

  it('calls skip.action when Skip button is clicked and enabled', () => {
    const skip = { action: vitest.fn(), label: 'Skip', disabled: false };
    renderWithStepContext({ id: 'test-id', next: null, locked: false, skip });
    fireEvent.click(screen.getByTestId('button-ghost-md'));
    expect(skip.action).toHaveBeenCalledWith('test-id');
  });

  it('does not call skip.action when Skip button is disabled', () => {
    const skip = { action: vitest.fn(), label: 'Skip', disabled: true };
    renderWithStepContext({ id: 'test-id', next: null, locked: false, skip });
    fireEvent.click(screen.getByTestId('button-ghost-md'));
    expect(skip.action).not.toHaveBeenCalled();
  });
});
