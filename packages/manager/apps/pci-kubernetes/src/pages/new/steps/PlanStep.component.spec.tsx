import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PlanTile from './PlanStep';
import { StepState } from '../useStep';

describe('PlanTile Component', () => {
  const mockOnSubmit = vi.fn();
  let step: StepState;

  beforeEach(() => {
    step = { isLocked: false } as StepState;
    mockOnSubmit.mockClear();
  });

  const renderComponent = () =>
    render(<PlanTile onSubmit={mockOnSubmit} step={step} />);

  test('renders all plan options', () => {
    renderComponent();
    expect(
      screen.getByTestId('plan-tile-radio-tile-standard'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('plan-tile-radio-tile-premium'),
    ).toBeInTheDocument();
  });

  test('selecting a plan updates state', () => {
    renderComponent();
    const standardOption = screen.getByTestId('plan-tile-radio-tile-standard');
    fireEvent.click(standardOption);
    expect(standardOption).toBeChecked();
  });

  test('displays disabled state for premium plan', () => {
    renderComponent();
    expect(screen.getByTestId('plan-tile-radio-tile-premium')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  test('submitting form calls onSubmit with selected plan', () => {
    renderComponent();
    const form = screen.getByTestId('form');
    fireEvent.submit(form);
    expect(mockOnSubmit).toHaveBeenCalledWith('standard');
  });

  test('does not allow changing selection when step is locked', () => {
    step.isLocked = true;
    renderComponent();
    expect(screen.getByTestId('plan-header-locked')).toBeInTheDocument();
  });
});
