import React from 'react';
import { describe, it, vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import RancherPlanTile, { RancherPlanTileProps } from './RancherPlanTile';
import { rancherPlan } from '../../_mock_/rancher-resource';
import { render } from '../../utils/test/test.provider';

const mockedUsedNavigate = vi.fn();
const mockSetSelectedPlan = vi.fn();
const [standardPlan] = rancherPlan;

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('react-router-dom', () => ({
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
