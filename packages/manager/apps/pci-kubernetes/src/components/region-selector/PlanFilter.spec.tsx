import { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TClusterPlanEnum } from '@/types';

import PlanFilter from './PlanFilter';

vi.mock('@ovhcloud/ods-components/react', async () => ({
  ...(await vi.importActual('@ovhcloud/ods-components/react')),

  OsdsRadioGroup: ({
    children,
    onOdsValueChange,
    value,
  }: {
    children: ReactNode;
    onOdsValueChange?: (e: CustomEvent) => void;
    value?: string;
  }) => (
    <div
      data-testid="radio-group"
      data-value={value}
      onChange={(e) =>
        onOdsValueChange?.({
          detail: { newValue: (e.target as HTMLInputElement).value },
        } as CustomEvent)
      }
    >
      {children}
    </div>
  ),
  OsdsRadio: ({ children, value }: { children: ReactNode; value: string }) => (
    <label data-testid={`radio-${value}`} data-value={value}>
      <input type="radio" name="plan" value={value} />
      {children}
    </label>
  ),
}));

describe('PlanFilter', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('rendering', () => {
    it('should render the filter label', () => {
      render(<PlanFilter />);

      expect(screen.getByText('add:kubernetes_add_region_plan_select')).toBeInTheDocument();
    });

    it('should render all plan options', () => {
      render(<PlanFilter />);

      expect(screen.getByTestId(`radio-${TClusterPlanEnum.ALL}`)).toBeInTheDocument();
      expect(screen.getByTestId(`radio-${TClusterPlanEnum.FREE}`)).toBeInTheDocument();
      expect(screen.getByTestId(`radio-${TClusterPlanEnum.STANDARD}`)).toBeInTheDocument();
    });

    it('should display the selected plan value', () => {
      render(<PlanFilter selectedPlan={TClusterPlanEnum.FREE} />);

      expect(screen.getByTestId('radio-group')).toHaveAttribute(
        'data-value',
        TClusterPlanEnum.FREE,
      );
    });
  });

  describe('interaction', () => {
    describe.each([
      {
        plan: TClusterPlanEnum.ALL,
        expectedText: 'Pci_projects_project_filter_by_plan_all',
      },
      { plan: TClusterPlanEnum.FREE, expectedText: 'Free' },
      { plan: TClusterPlanEnum.STANDARD, expectedText: 'Standard' },
    ] as const)('when selecting $plan', ({ plan, expectedText }) => {
      it(`should call onSelectPlan with "${plan}"`, async () => {
        const onSelectPlan = vi.fn();
        render(<PlanFilter onSelectPlan={onSelectPlan} />);

        expect(screen.getByText(expectedText)).toBeInTheDocument();

        const radio = screen
          .getByTestId(`radio-${plan}`)
          .querySelector('input') as HTMLInputElement;
        await user.click(radio);

        expect(onSelectPlan).toHaveBeenCalledWith(plan);
      });
    });

    it('should not throw when onSelectPlan is not provided', async () => {
      render(<PlanFilter />);

      const radio = screen
        .getByTestId(`radio-${TClusterPlanEnum.FREE}`)
        .querySelector('input') as HTMLInputElement;

      await expect(user.click(radio)).resolves.not.toThrow();
    });
  });
});
