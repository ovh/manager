import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PlanTile from './PlanStep.component';
import { StepState } from '../useStep';
import { DeploymentMode, TClusterPlan } from '@/types';

describe('PlanTile Component', () => {
  const mockOnSubmit = vi.fn();
  let step: StepState;

  const plans: TClusterPlan[] = ['free', 'standard'];

  beforeEach(() => {
    step = { isLocked: false } as StepState;
    mockOnSubmit.mockClear();
  });

  const renderComponent = (plan: TClusterPlan) => {
    const region =
      plan === 'free' ? DeploymentMode.MONO_ZONE : DeploymentMode.MULTI_ZONES;
    render(<PlanTile type={region} onSubmit={mockOnSubmit} step={step} />);
  };

  test.each(plans)('renders all plan options', (plan) => {
    renderComponent(plan);
    expect(screen.getByTestId('plan-tile-radio-tile-free')).toBeInTheDocument();
    expect(
      screen.getByTestId('plan-tile-radio-tile-standard'),
    ).toBeInTheDocument();
  });

  test.each(plans)('selecting %s plan updates state', (plan) => {
    renderComponent(plan);
    const selectedPlan = screen.getByTestId(`plan-tile-radio-tile-${plan}`);
    fireEvent.click(selectedPlan);
    expect(selectedPlan).toBeChecked();
    expect(
      screen.getByTestId(
        `plan-tile-radio-tile-${plan === 'free' ? 'standard' : 'free'}`,
      ),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  test.each([
    [DeploymentMode.MONO_ZONE, 'free', 'standard'],
    [DeploymentMode.MULTI_ZONES, 'standard', 'free'],
  ])(
    'displays disabled state for selected plan if region is %s',
    (region, availablePlan, unavailablePlan) => {
      render(<PlanTile type={region} onSubmit={mockOnSubmit} step={step} />);

      const unavailablePlanOption = screen.getByTestId(
        `plan-tile-radio-tile-${unavailablePlan}`,
      );
      fireEvent.click(unavailablePlanOption);
      expect(
        screen.getByTestId(`plan-tile-radio-tile-${availablePlan}`),
      ).toBeChecked();
      expect(unavailablePlanOption).toHaveAttribute('aria-disabled', 'true');
    },
  );

  test.each(plans)(
    'submitting form calls onSubmit with selected %s plan',
    (plan) => {
      renderComponent(plan);
      const form = screen.getByTestId('form');
      fireEvent.submit(form);
      expect(mockOnSubmit).toHaveBeenCalledWith(plan);
    },
  );

  test.each(plans)(
    'does not allow changing selection when step is locked',
    (plan) => {
      step.isLocked = true;
      renderComponent(plan);
      expect(screen.getByTestId('plan-header-locked')).toBeInTheDocument();
    },
  );
});
