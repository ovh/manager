import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TConsumptionDetail } from '@/api/hook/useConsumption';
import { wrapper } from '@/wrapperRenders';
import HourlyConsumption from './HourlyConsumption.component';

vi.mock('@/api/hook/useShares', () => ({
  useShares: vi.fn(() => ({ data: [], isPending: false })),
}));

describe('HourlyConsumption', () => {
  const mockConsumption: TConsumptionDetail = {
    hourlyInstances: [],
    snapshots: [],
    volumes: [],
    objectStorages: [],
    archiveStorages: [],
    shares: [],
    shareSnapshots: [],
    coldArchive: [],
    bandwidthByRegions: [],
    privateRegistry: [],
    aiEndpoints: [],
    kubernetesLoadBalancer: [],
    managedKubernetesService: [],
    quantum: [],
    training: [],
    notebooks: [],
    rancher: [],
    dataplatform: [],
    monthlyInstances: [],
    monthlySavingsPlanList: [],
    aiDeploy: [],
    dataProcessing: [],
    databases: [],
    floatingIP: [],
    publicIP: [],
    gateway: [],
    octaviaLoadBalancer: [],
    totals: {
      total: 10.5,
      hourly: {
        dataplatform: 10.5,
        aiEndpoints: 10.5,
        instance: 10.5,
        snapshot: 5.25,
        volume: 7.75,
        objectStorage: 5.25,
        archiveStorage: 7.75,
        rancher: 10.5,
        bandwidth: 5.25,
        privateRegistry: 7.75,
        kubernetesLoadBalancer: 10.5,
        notebooks: 5.25,
        coldArchive: 7.75,
        aiDeploy: 10.5,
        dataProcessing: 5.25,
        databases: 7.75,
        floatingIP: 10.5,
        publicIP: 5.25,
        gateway: 7.75,
        octaviaLoadBalancer: 10.5,
        serving: 5.25,
        training: 7.75,
        total: 10.5,
      },
      monthly: {
        total: 10.5,
        savingsPlan: 10,
        instance: 5.25,
      },
    },
  };

  const consumptionWithShares: TConsumptionDetail = {
    ...mockConsumption,
    shares: [
      {
        name: 'share',
        region: 'WAW1',
        totalPrice: 1.66,
        resourceId: '77402726-715c-4531-a1e1-7de5292bec4c',
        quantity: { unit: 'Hour', value: 8550 },
      },
    ],
  };

  it('should render the component', () => {
    const { asFragment } = render(
      <HourlyConsumption consumption={mockConsumption} isTrustedZone={false} />,
      { wrapper },
    );

    expect(asFragment()).toBeDefined();
  });

  it('shows the file storage section when shares exist and region is not US', () => {
    const { queryByText } = render(
      <HourlyConsumption
        consumption={consumptionWithShares}
        isTrustedZone={false}
        isUsRegion={false}
      />,
      { wrapper },
    );

    expect(queryByText(/cpbc_file_storage_detail_title/)).toBeInTheDocument();
  });

  it('hides the file storage section in the US region', () => {
    const { queryByText } = render(
      <HourlyConsumption
        consumption={consumptionWithShares}
        isTrustedZone={false}
        isUsRegion
      />,
      { wrapper },
    );

    expect(
      queryByText(/cpbc_file_storage_detail_title/),
    ).not.toBeInTheDocument();
  });

  it('hides the file storage section when there is no share consumption', () => {
    const { queryByText } = render(
      <HourlyConsumption
        consumption={mockConsumption}
        isTrustedZone={false}
        isUsRegion={false}
      />,
      { wrapper },
    );

    expect(
      queryByText(/cpbc_file_storage_detail_title/),
    ).not.toBeInTheDocument();
  });
});
