import { ReactNode } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DeploymentMode, TClusterPlanEnum, TPlan } from '@/types';

import usePlanData from '../hooks/usePlanData';
import PlanTile, { TPlanTileProps } from './PlanStep.component';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useCatalogPrice: () => ({
    getFormattedHourlyCatalogPrice: (price: number) => `€${(price / 100000000).toFixed(4)}/h`,
    getFormattedMonthlyCatalogPrice: (price: number) => `€${(price / 100000000).toFixed(2)}/mo`,
  }),
  convertHourlyPriceToMonthly: (price: number) => price * 720,
}));

vi.mock('@/components/radio-tile/RadioTile.component', () => ({
  default: ({
    children,
    checked,
    disabled,
    onChange,
    'data-testid': testId,
  }: {
    children: ReactNode;
    checked?: boolean;
    disabled?: boolean;

    onChange?: () => void;
    'data-testid'?: string;
  }) => (
    <div
      data-testid={testId}
      data-checked={checked}
      data-disabled={disabled}
      onClick={!disabled ? onChange : undefined}
      onKeyDown={!disabled ? onChange : undefined}
    >
      {children}
    </div>
  ),
}));

vi.mock('../hooks/usePlanData', () => ({
  default: vi.fn(),
}));

const mockUsePlanData = vi.mocked(usePlanData);

const defaultPlans = [
  {
    title: 'kube_add_plan_title_free',
    description: 'kube_add_plan_description_free',
    content: ['content_free_1', 'content_free_2'],
    value: TClusterPlanEnum.FREE,
    code: 'mks.free.hour.consumption',
    price: 0,
  },
  {
    title: 'kube_add_plan_title_standard',
    description: 'kube_add_plan_description_standard',
    content: ['content_standard_1', 'content_standard_2'],
    value: TClusterPlanEnum.STANDARD,
    code: 'mks.standard.hour.consumption',
    price: 1500000,
  },
] as TPlan[];

const defaultProps = {
  onSubmit: vi.fn(),
  step: { isLocked: false, isOpen: false, isChecked: false },
  type: 'mono' as DeploymentMode,
  codes: ['mks.free.hour.consumption', 'mks.standard.hour.consumption'],
} as TPlanTileProps;

describe('PlanTile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePlanData.mockReturnValue({
      plans: defaultPlans,
      isPending: false,
    });
  });

  describe('loading state', () => {
    it('should display spinner when isPending is true', () => {
      mockUsePlanData.mockReturnValue({
        plans: [],
        isPending: true,
      });

      render(<PlanTile {...defaultProps} />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should not display spinner when isPending is false', () => {
      render(<PlanTile {...defaultProps} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('plan tiles rendering', () => {
    it('should render all plan tiles', () => {
      render(<PlanTile {...defaultProps} />);

      expect(
        screen.getByTestId(`plan-tile-radio-tile-${TClusterPlanEnum.FREE}`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`plan-tile-radio-tile-${TClusterPlanEnum.STANDARD}`),
      ).toBeInTheDocument();
    });

    it('should render plan headers with translated titles', () => {
      render(<PlanTile {...defaultProps} />);

      expect(screen.getAllByTestId('plan-header')).toHaveLength(2);
    });

    it.each([
      { planCode: null, expectedDisabled: 'true' },
      { planCode: 'mks.free.hour.consumption', expectedDisabled: 'false' },
    ])(
      'should set disabled=$expectedDisabled when code is $planCode',
      ({ planCode, expectedDisabled }) => {
        mockUsePlanData.mockReturnValue({
          plans: [
            {
              ...defaultPlans[0],
              code: planCode,
            } as TPlan,
          ],
          isPending: false,
        });

        render(<PlanTile {...defaultProps} />);

        const tile = screen.getByTestId(`plan-tile-radio-tile-${TClusterPlanEnum.FREE}`);
        expect(tile).toHaveAttribute('data-disabled', expectedDisabled);
      },
    );
  });

  describe('plan selection', () => {
    it('should select plan on click', () => {
      render(<PlanTile {...defaultProps} />);

      const standardTile = screen.getByTestId(`plan-tile-radio-tile-${TClusterPlanEnum.STANDARD}`);
      fireEvent.click(standardTile);

      expect(standardTile).toHaveAttribute('data-checked', 'true');
    });

    it('should not select disabled plan on click', () => {
      mockUsePlanData.mockReturnValue({
        plans: [{ ...defaultPlans[0], code: null } as TPlan, defaultPlans[1] as TPlan],
        isPending: false,
      });

      render(<PlanTile {...defaultProps} />);

      const freeTile = screen.getByTestId(`plan-tile-radio-tile-${TClusterPlanEnum.FREE}`);
      fireEvent.click(freeTile);

      expect(freeTile).toHaveAttribute('data-checked', 'false');
    });
  });

  describe('form submission', () => {
    it('should call onSubmit with selected plan when form is submitted', () => {
      const onSubmit = vi.fn();
      render(<PlanTile {...defaultProps} onSubmit={onSubmit} />);

      const standardTile = screen.getByTestId(`plan-tile-radio-tile-${TClusterPlanEnum.STANDARD}`);
      fireEvent.click(standardTile);

      const form = screen.getByTestId('form');
      fireEvent.submit(form);

      expect(onSubmit).toHaveBeenCalledWith(TClusterPlanEnum.STANDARD);
    });

    it('should render submit button when step is not locked', () => {
      render(<PlanTile {...defaultProps} />);

      expect(
        screen.getByRole('button', { name: 'stepper:common_stepper_next_button_label' }),
      ).toBeInTheDocument();
    });

    it('should not render submit button when step is locked', () => {
      render(
        <PlanTile {...defaultProps} step={{ isLocked: true, isChecked: false, isOpen: true }} />,
      );

      expect(
        screen.queryByRole('button', { name: 'stepper:common_stepper_next_button_label' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('locked state', () => {
    it('should render locked view when step is locked', () => {
      render(
        <PlanTile {...defaultProps} step={{ isLocked: true, isChecked: false, isOpen: true }} />,
      );

      expect(screen.getByTestId('plan-header-locked')).toBeInTheDocument();
    });

    it('should not render plan tiles when step is locked', () => {
      render(
        <PlanTile {...defaultProps} step={{ isLocked: true, isChecked: false, isOpen: true }} />,
      );

      expect(
        screen.queryByTestId(`plan-tile-radio-tile-${TClusterPlanEnum.FREE}`),
      ).not.toBeInTheDocument();
    });
  });

  describe('subtitle', () => {
    it.each([
      { isLocked: false, shouldDisplay: true },
      { isLocked: true, shouldDisplay: false },
    ])(
      'should display subtitle: $shouldDisplay when isLocked is $isLocked',
      ({ isLocked, shouldDisplay }) => {
        render(<PlanTile {...defaultProps} step={{ isLocked, isChecked: false, isOpen: true }} />);

        if (shouldDisplay) {
          expect(screen.getByText('kube_add_plan_subtitle')).toBeInTheDocument();
        } else {
          expect(screen.queryByText('kube_add_plan_subtitle')).not.toBeInTheDocument();
        }
      },
    );
  });
});

describe('PlanTile.Banner', () => {
  it.each([
    { type: DeploymentMode.MULTI_ZONES, shouldDisplay: true },
    { type: DeploymentMode.MONO_ZONE as DeploymentMode, shouldDisplay: false },
  ])('should display banner: $shouldDisplay when type is $type', ({ type, shouldDisplay }) => {
    render(<PlanTile.Banner type={type} />);

    if (shouldDisplay) {
      expect(screen.getByText(/kube_add_plan_content_unavailable_3AZ_banner/)).toBeInTheDocument();
    } else {
      expect(
        screen.queryByText(/kube_add_plan_content_unavailable_3AZ_banner/),
      ).not.toBeInTheDocument();
    }
  });

  it('should hide banner when dismissed', () => {
    render(<PlanTile.Banner type={DeploymentMode.MULTI_ZONES} />);

    const message = screen.getByText(/kube_add_plan_content_unavailable_3AZ_banner/);
    expect(message).toBeInTheDocument();

    // Find and click dismiss button (onRemove callback)
    const dismissButton = document.querySelector('[dismissible]');
    if (dismissButton) {
      fireEvent.click(dismissButton);
    }
  });
});

describe('PlanTile.Header', () => {
  const defaultHeaderProps = {
    selected: false,
    title: 'kube_add_plan_title_free',
    description: 'kube_add_plan_description_free',
    disabled: false,
    value: TClusterPlanEnum.FREE,
    type: 'mono' as DeploymentMode,
  };

  it('should render title and description', () => {
    render(<PlanTile.Header {...defaultHeaderProps} />);

    expect(screen.getByTestId('plan-header')).toHaveTextContent('kube_add_plan_title_free');
    expect(screen.getByText('kube_add_plan_description_free')).toBeInTheDocument();
  });

  it.each([
    { disabled: true, shouldShowBadge: true },
    { disabled: false, shouldShowBadge: false },
  ])(
    'should show unavailable badge: $shouldShowBadge when disabled is $disabled',
    ({ disabled, shouldShowBadge }) => {
      render(<PlanTile.Header {...defaultHeaderProps} disabled={disabled} />);

      if (shouldShowBadge) {
        expect(screen.getByText('kube_add_plan_content_not_available')).toBeInTheDocument();
      } else {
        expect(screen.queryByText('kube_add_plan_content_not_available')).not.toBeInTheDocument();
      }
    },
  );
});

describe('PlanTile.Footer', () => {
  const defaultFooterProps = {
    content: 'kube_add_plan_footer_free',
    price: 0,
    isFreePlan: true,
    isDisabled: false,
  };

  it('should render empty footer when disabled', () => {
    render(<PlanTile.Footer {...defaultFooterProps} isDisabled={true} />);
    expect(screen.queryByText('kube_add_plan_footer_free')).not.toBeInTheDocument();
  });

  it('should render content text for free plan', () => {
    render(<PlanTile.Footer {...defaultFooterProps} />);
    expect(screen.getByText('kube_add_plan_footer_free')).toBeInTheDocument();
  });

  it('should not render price for free plan', () => {
    render(<PlanTile.Footer {...defaultFooterProps} />);

    expect(screen.queryByText(/€/)).not.toBeInTheDocument();
  });

  it('should render hourly and monthly prices', () => {
    render(
      <PlanTile.Footer
        content="kube_add_plan_footer_standard"
        price={1500000}
        isFreePlan={false}
        isDisabled={false}
      />,
    );

    expect(screen.getByText(/€0.0150\/h/)).toBeInTheDocument();
    expect(screen.getByText(/€10.80\/mo/)).toBeInTheDocument();
  });

  it.each([
    { price: null, shouldShowPrice: false },
    { price: 1500000, shouldShowPrice: true },
  ])('should show price: $shouldShowPrice when price is $price', ({ price, shouldShowPrice }) => {
    render(
      <PlanTile.Footer
        content="kube_add_plan_footer_standard"
        price={price}
        isFreePlan={false}
        isDisabled={false}
      />,
    );

    if (shouldShowPrice) {
      expect(screen.getByText(/€10/)).toBeInTheDocument();
    } else {
      expect(screen.queryByText(/€/)).not.toBeInTheDocument();
    }
  });
});

describe('PlanTile.LockedView', () => {
  beforeEach(() => {
    mockUsePlanData.mockReturnValue({
      plans: defaultPlans,
      isPending: false,
    });
  });

  it('should render locked view with plan title', () => {
    render(
      <PlanTile.LockedView
        value={TClusterPlanEnum.FREE}
        codes={['mks.free.hour.consumption']}
        type={DeploymentMode.MONO_ZONE}
      />,
    );

    expect(screen.getByTestId('plan-header-locked')).toHaveTextContent('kube_add_plan_title_free');
  });

  it('should return null when plan not found', () => {
    mockUsePlanData.mockReturnValue({
      plans: [],
      isPending: false,
    });

    const { container } = render(
      <PlanTile.LockedView
        value={TClusterPlanEnum.FREE}
        codes={[]}
        type={DeploymentMode.MONO_ZONE}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
