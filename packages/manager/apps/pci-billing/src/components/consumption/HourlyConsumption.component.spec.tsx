import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TConsumptionDetail } from '@/api/hook/useConsumption';
import { wrapper } from '@/wrapperRenders';
import HourlyConsumption from './HourlyConsumption.component';

describe('HourlyConsumption', () => {
  const mockConsumption = {
    hourlyInstances: [],
    snapshots: [],
    volumes: [],
    objectStorages: [],
    archiveStorages: [],
    coldArchive: [],
    bandwidthByRegions: [],
    privateRegistry: [],
    kubernetesLoadBalancer: [],
    training: [],
    notebooks: [],
    aiDeploy: [],
    dataProcessing: [],
    databases: [],
    floatingIP: [],
    publicIP: [],
    gateway: [],
    octaviaLoadBalancer: [],
    totals: {
      hourly: {
        instance: 10.5,
        snapshot: 5.25,
        volume: 7.75,
      },
    },
  } as TConsumptionDetail;

  it('matches snapshot', () => {
    const { asFragment } = render(
      <HourlyConsumption consumption={mockConsumption} isTrustedZone={false} />,
      { wrapper },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
