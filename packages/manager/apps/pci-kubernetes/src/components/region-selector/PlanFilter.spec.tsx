import { ReactNode } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
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
  describe('rendering', () => {
    it('should render the filter label', () => {
      render(<PlanFilter />);

      expect(screen.getByText('pci_projects_project_filter_by_region')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    describe.each([
      { plan: TClusterPlanEnum.ALL, expectedText: 'pci_projects_project_filter_by_plan_All' },
      { plan: TClusterPlanEnum.FREE, expectedText: 'Free' },
      { plan: TClusterPlanEnum.STANDARD, expectedText: 'Standard' },
    ] as const)('when selecting $plan', ({ plan, expectedText }) => {
      it(`should call onSelectPlan with "${plan}"`, async () => {
        const onSelectPlan = vi.fn();
        render(<PlanFilter onSelectPlan={onSelectPlan} />);
        expect(screen.getByText(expectedText)).toBeInTheDocument();
        expect(screen.getByTestId(`radio-${plan}`)).toBeInTheDocument();
        const radio = screen
          .getByTestId(`radio-${plan}`)
          .querySelector('input') as HTMLInputElement;
        fireEvent.click(radio);

        expect(onSelectPlan).toHaveBeenCalledWith(plan);
      });
    });

    it('should call onSelectPlan with "all" when newValue is empty', () => {
      const onSelectPlan = vi.fn();
      render(<PlanFilter onSelectPlan={onSelectPlan} />);

      const radioGroup = screen.getByTestId('radio-group');
      radioGroup.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          detail: { newValue: '' },
        }),
      );
    });
  });
});
