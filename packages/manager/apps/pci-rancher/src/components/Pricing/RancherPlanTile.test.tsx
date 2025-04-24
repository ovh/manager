import React from 'react';
import { afterEach, describe, vi } from 'vitest';
import { rancherPlan } from '@/__mocks__/rancher-resource';
import RancherPlanTile, { RancherPlanTileProps } from './RancherPlanTile';
import { render, waitFor } from '@/utils/test/test.provider';

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
});
