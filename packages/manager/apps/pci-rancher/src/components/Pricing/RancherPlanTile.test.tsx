import React from 'react';
import { afterEach, describe, vi } from 'vitest';
import { rancherPlan } from '@/__mocks__/rancher-resource';
import RancherPlanTile, { RancherPlanTileProps } from './RancherPlanTile';
import { render, waitFor } from '@/utils/test/test.provider';
import dashboardTranslation from '@translation/dashboard/Messages_fr_FR.json';

const mockedUsedNavigate = vi.fn();
const mockSetSelectedPlan = vi.fn();
const [standardPlan] = rancherPlan;

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: vi.fn(() => ({
    getURL: vi.fn(() => Promise.resolve('123')),
    data: [],
  })),
  useTracking: vi.fn(() => ({
    trackPage: vi.fn(),
    trackClick: vi.fn(),
  })),
}));

const setupSpecTest = async (props?: Partial<RancherPlanTileProps>) =>
  waitFor(() =>
    render(
      <RancherPlanTile
        plan={standardPlan}
        name="Test Plan"
        selectedPlan={standardPlan}
        setSelectedPlan={mockSetSelectedPlan}
        planDescription="Description"
        formattedHourlyPrice="0,00685 € HT / heure"
        formattedMonthlyPrice="4,93 € HT / mois"
        isPricing={true}
        {...props}
      />,
    ),
  );

describe('RancherPlanTile', () => {
  it('renders correctly with given props', async () => {
    const screen = await setupSpecTest();
    expect(screen.getByText('Test Plan')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('0,00685 € HT / heure')).toBeInTheDocument();
    expect(screen.getByText('~ 4,93 € HT / mois')).toBeInTheDocument();
  });

  describe('Free Trial', () => {
    it('Given that showFreeTrialBadge is true, I should see the Free Trial badge', async () => {
      const screen = await setupSpecTest({ showFreeTrialBadge: true });
      const badge = screen.getByText(dashboardTranslation.freeTrialBadge);

      expect(badge).toBeInTheDocument();
    });

    it('Given that showFreeTrialBadge is false, I should not see the Free Trial badge', async () => {
      const screen = await setupSpecTest({ showFreeTrialBadge: false });
      const badge = screen.queryByText(dashboardTranslation.freeTrialBadge);

      expect(badge).not.toBeInTheDocument();
    });

    it('Given that showFreeTrialBadge is true and isPricing is true, I should see the free trial price labels', async () => {
      const screen = await setupSpecTest({
        showFreeTrialBadge: true,
        isPricing: true,
      });
      const freeLabel = screen.getByText(
        dashboardTranslation.freeTrialPriceLabel,
      );
      const thenLabel = screen.getByText(
        dashboardTranslation.freeTrialThenLabel,
      );

      expect(freeLabel).toBeInTheDocument();
      expect(thenLabel).toBeInTheDocument();
    });

    it('Given that showFreeTrialBadge is false, I should not see the free trial price labels', async () => {
      const screen = await setupSpecTest({
        showFreeTrialBadge: false,
        isPricing: true,
      });
      const freeLabel = screen.queryByText(
        dashboardTranslation.freeTrialPriceLabel,
      );
      const thenLabel = screen.queryByText(
        dashboardTranslation.freeTrialThenLabel,
      );

      expect(freeLabel).not.toBeInTheDocument();
      expect(thenLabel).not.toBeInTheDocument();
    });
  });
});
