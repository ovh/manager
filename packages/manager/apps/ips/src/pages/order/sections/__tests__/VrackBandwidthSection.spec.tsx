import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import '@/test-utils/setupUnitTests';

import { OrderContext, OrderContextType } from '../../order.context';
import { VrackBandwidthSection } from '../VrackBandwidthSection.component';

vi.mock('@ovh-ux/manager-network-common', () => ({
  DEFAULT_BANDWIDTH_PLAN_CODE: 'vrack-bandwidth-default',
  useGetPublicRoutingBandwidthLimits: vi.fn(),
  useVrackBandwidthCartOptions: vi.fn(),
  useBandwidthFormatConverter: () => (mbps: number) => ({
    value: `${mbps}`,
    unit: 'Mbps',
    simpleFormat: `${mbps} Mbps`,
    perSecondFormat: `${mbps}Mbps/s`,
  }),
}));

import {
  useGetPublicRoutingBandwidthLimits,
  useVrackBandwidthCartOptions,
} from '@ovh-ux/manager-network-common';

const DEFAULT_REGION = 'eu-west-par';
const DEFAULT_SERVICE = 'pn-0000001';

const mockBandwidthLimits = [
  {
    region: DEFAULT_REGION,
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
  },
];

// Use priceInUcents: 0 to avoid rendering PriceDescription (which requires ShellContext)
const mockCartOptions = {
  [DEFAULT_REGION]: [
    { planCode: 'bandwidth-5000', bandwidthLimit: 5000, priceInUcents: 0 },
    { planCode: 'bandwidth-10000', bandwidthLimit: 10000, priceInUcents: 0 },
  ],
};

const defaultContextValue: Partial<OrderContextType> = {
  selectedService: DEFAULT_SERVICE,
  selectedRegion: DEFAULT_REGION,
  selectedVrackBandwidthPlanCode: undefined,
  setSelectedVrackBandwidthPlanCode: vi.fn(),
};

const renderComponent = (contextOverrides?: Partial<OrderContextType>) =>
  render(
    <OrderContext.Provider
      value={
        { ...defaultContextValue, ...contextOverrides } as OrderContextType
      }
    >
      <VrackBandwidthSection />
    </OrderContext.Provider>,
  );

describe('VrackBandwidthSection', () => {
  beforeEach(() => {
    vi.mocked(useGetPublicRoutingBandwidthLimits).mockReturnValue({
      bandwidthLimits: mockBandwidthLimits,
      isError: false,
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof useGetPublicRoutingBandwidthLimits>);

    vi.mocked(useVrackBandwidthCartOptions).mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
      vrackCartBandwidthOptionListByRegion: mockCartOptions,
    } as unknown as ReturnType<typeof useVrackBandwidthCartOptions>);
  });

  it('should display a spinner while loading', () => {
    vi.mocked(useGetPublicRoutingBandwidthLimits).mockReturnValue({
      bandwidthLimits: undefined,
      isError: false,
      isLoading: true,
      error: null,
    } as unknown as ReturnType<typeof useGetPublicRoutingBandwidthLimits>);

    const { container } = renderComponent();

    expect(container.querySelector('ods-spinner')).toBeInTheDocument();
    expect(container.querySelectorAll('ods-card')).toHaveLength(0);
  });

  it('should render the section title and description', () => {
    renderComponent();

    expect(
      screen.getByText('vrack_bandwidth_section_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('vrack_bandwidth_section_description_1'),
    ).toBeInTheDocument();
  });

  it('should render one card per bandwidth option', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('ods-card')).toHaveLength(2);
  });

  it('should display the "current_bandwidth" message on the card matching the current limit', () => {
    renderComponent();

    expect(screen.getByText('current_bandwidth')).toBeInTheDocument();
  });

  it('should display a tooltip on cards with bandwidth greater than the current limit', () => {
    renderComponent();

    expect(
      screen.getByText('bandwidth_option_card_tooltip'),
    ).toBeInTheDocument();
  });

  it('should call setSelectedVrackBandwidthPlanCode with the plan code when selecting an upgrade option', async () => {
    const setSelectedVrackBandwidthPlanCode = vi.fn();
    const { container } = renderComponent({
      setSelectedVrackBandwidthPlanCode,
    });

    const cards = container.querySelectorAll('ods-card');
    await userEvent.click(cards[1]); // upgrade card (10000 Mbps)

    expect(setSelectedVrackBandwidthPlanCode).toHaveBeenCalledWith(
      'bandwidth-10000',
    );
  });

  it('should call setSelectedVrackBandwidthPlanCode with undefined when selecting the current bandwidth', async () => {
    const setSelectedVrackBandwidthPlanCode = vi.fn();
    const { container } = renderComponent({
      setSelectedVrackBandwidthPlanCode,
    });

    const cards = container.querySelectorAll('ods-card');
    await userEvent.click(cards[0]); // current bandwidth card (5000 Mbps)

    expect(setSelectedVrackBandwidthPlanCode).toHaveBeenCalledWith(undefined);
  });

  it('should not show the double order info message when bandwidthLimitType is "default"', () => {
    renderComponent({ selectedVrackBandwidthPlanCode: 'bandwidth-10000' });

    expect(
      screen.queryByText('vrack_bandwidth_double_order_info_message'),
    ).not.toBeInTheDocument();
  });

  it('should show the double order info message when all three conditions are met', async () => {
    // Condition 1: bandwidthLimitType !== 'default'
    vi.mocked(useGetPublicRoutingBandwidthLimits).mockReturnValue({
      bandwidthLimits: [
        {
          region: DEFAULT_REGION,
          bandwidthLimit: 5000,
          bandwidthLimitType: 'custom',
        },
      ],
      isError: false,
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof useGetPublicRoutingBandwidthLimits>);

    // Condition 3: selectedVrackBandwidthPlanCode !== DEFAULT_BANDWIDTH_PLAN_CODE
    const { container } = renderComponent({
      selectedVrackBandwidthPlanCode: 'bandwidth-10000',
    });

    // Condition 2: selectedBandwidth !== currentLimit — achieved by clicking the upgrade card
    const cards = container.querySelectorAll('ods-card');
    await userEvent.click(cards[1]);

    expect(
      screen.getByText('vrack_bandwidth_double_order_info_message'),
    ).toBeInTheDocument();
  });
});
