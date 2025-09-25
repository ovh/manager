import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { useCatalog } from '@ovh-ux/manager-pci-common';

import { DeploymentMode, TClusterPlan, TClusterPlanEnum } from '@/types';

import { StepState } from '../hooks/useStep';
import PlanTile from './PlanStep.component';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  ...vi.importActual('@ovh-ux/manager-pci-common'),
  useCatalog: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...actual,
    useCatalogPrice: () => ({
      getFormattedHourlyCatalogPrice: (price: number) => `€${price}/h`,
      getFormattedMonthlyCatalogPrice: (price: number) => `€${price}/mo`,
    }),
    convertHourlyPriceToMonthly: (price: number) => price * 730,
  };
});

describe('PlanTile Component', () => {
  const mockOnSubmit = vi.fn();
  let step: StepState;

  const plans: TClusterPlan[] = [TClusterPlanEnum.FREE, TClusterPlanEnum.STANDARD];

  beforeEach(() => {
    step = { isLocked: false } as StepState;
    vi.mocked(useCatalog).mockReturnValue({
      data: {
        addons: [
          {
            planCode: 'mks.free.hour.consumption',
            pricings: [{ price: 0 }],
          },
          {
            planCode: 'mks.standard.hour.consumption.3az',
            pricings: [{ price: 123 }],
          },
        ],
      },
    } as ReturnType<typeof useCatalog>);
    mockOnSubmit.mockClear();
  });

  const renderComponent = (plan: TClusterPlan) => {
    const region = plan === 'free' ? DeploymentMode.MONO_ZONE : DeploymentMode.MULTI_ZONES;
    render(<PlanTile type={region} onSubmit={mockOnSubmit} step={step} />);
  };

  test.each(plans)('renders all plan options', (plan) => {
    renderComponent(plan);
    expect(screen.getByTestId('plan-tile-radio-tile-free')).toBeInTheDocument();
    expect(screen.getByTestId('plan-tile-radio-tile-standard')).toBeInTheDocument();
  });

  test.each(plans)('selecting %s plan updates state', (plan) => {
    renderComponent(plan);
    const selectedPlan = screen.getByTestId(`plan-tile-radio-tile-${plan}`);
    fireEvent.click(selectedPlan);
    expect(selectedPlan).toBeChecked();
    expect(
      screen.getByTestId(`plan-tile-radio-tile-${plan === 'free' ? 'standard' : 'free'}`),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  test.each([
    [DeploymentMode.MONO_ZONE, 'free', 'standard'],
    [DeploymentMode.MULTI_ZONES, 'standard', 'free'],
  ])(
    'displays disabled state for selected plan if region is %s',
    (region, availablePlan, unavailablePlan) => {
      render(<PlanTile type={region} onSubmit={mockOnSubmit} step={step} />);

      const unavailablePlanOption = screen.getByTestId(`plan-tile-radio-tile-${unavailablePlan}`);
      fireEvent.click(unavailablePlanOption);
      expect(screen.getByTestId(`plan-tile-radio-tile-${availablePlan}`)).toBeChecked();
      expect(unavailablePlanOption).toHaveAttribute('aria-disabled', 'true');
    },
  );

  test.each(plans)('submitting form calls onSubmit with selected %s plan', (plan) => {
    renderComponent(plan);
    const form = screen.getByTestId('form');
    fireEvent.submit(form);
    expect(mockOnSubmit).toHaveBeenCalledWith(plan);
  });

  test.each(plans)('does not allow changing selection when step is locked', (plan) => {
    step.isLocked = true;
    renderComponent(plan);
    expect(screen.getByTestId('plan-header-locked')).toBeInTheDocument();
  });
});
