import React from 'react';
import { rancherPlan } from '@/_mock_/rancher-resource';
import RancherPlanTile, { RancherPlanTileProps } from './RancherPlanTile';
import { render, waitFor } from '@/utils/test/test.provider';

const mockedUsedNavigate = jest.fn();
const mockSetSelectedPlan = jest.fn();
const [standardPlan] = rancherPlan;

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: jest.fn(() => ({
    getURL: jest.fn(() => Promise.resolve('123')),
    data: [],
  })),
  useTracking: jest.fn(() => ({
    trackPage: jest.fn(),
    trackClick: jest.fn(),
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
