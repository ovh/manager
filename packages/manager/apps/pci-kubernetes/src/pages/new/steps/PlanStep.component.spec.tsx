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

  const renderComponent = (region) =>
    render(<PlanTile type={region} onSubmit={mockOnSubmit} step={step} />);

  test('renders all plan options', () => {
    renderComponent('region');
    expect(
      screen.getByTestId('plan-tile-radio-tile-standard'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('plan-tile-radio-tile-premium'),
    ).toBeInTheDocument();
  });

  test('selecting a plan updates state', () => {
    renderComponent('region');
    const standardOption = screen.getByTestId('plan-tile-radio-tile-standard');
    fireEvent.click(standardOption);
    expect(standardOption).toBeChecked();
    expect(screen.getByTestId('plan-tile-radio-tile-premium')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  test('displays disabled state for premium plan', () => {
    renderComponent('region-3-az');
    const standardOption = screen.getByTestId('plan-tile-radio-tile-standard');
    fireEvent.click(standardOption);
    expect(screen.getByTestId('plan-tile-radio-tile-premium')).toBeChecked();
    expect(standardOption).toHaveAttribute('aria-disabled', 'true');
  });

  test('submitting form calls onSubmit with selected plan', () => {
    renderComponent('region');
    const form = screen.getByTestId('form');
    fireEvent.submit(form);
    expect(mockOnSubmit).toHaveBeenCalledWith('standard');
  });

  test('does not allow changing selection when step is locked', () => {
    step.isLocked = true;
    renderComponent('region');
    expect(screen.getByTestId('plan-header-locked')).toBeInTheDocument();
  });
});
