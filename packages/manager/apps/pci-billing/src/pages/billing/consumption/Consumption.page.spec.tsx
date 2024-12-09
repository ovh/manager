import { UseQueryResult } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { wrapper } from '@/wrapperRenders';
import * as _useConsumptionHook from '@/api/hook/useConsumption';
import Consumption from './Consumption.page';

const mockedConsumption = {
  hourlyInstances: [
    {
      instanceId: 'inst-a1b2c3d4',
      quantity: {
        unit: 'Hour',
        value: 240,
      },
      totalPrice: 12.5,
      reference: 'b3-medium',
      region: 'EU-WEST-1',
    },
  ],
  monthlyInstances: [
    {
      activation: '2024-02-15T10:30:00.000Z',
      instanceId: 'monthly-inst-5e6f7g8h',
      totalPrice: 275.75,
      reference: 'b2-large',
      region: 'US-EAST-2',
    },
  ],
  objectStorages: [
    {
      bucketName: 'backup-storage',
      stored: {
        quantity: { unit: 'GB', value: 500 },
        totalPrice: 25.0,
      },
      totalPrice: 35.5,
      region: 'EU-CENTRAL-1',
    },
  ],
  archiveStorages: [
    {
      bucketName: 'cold-archive',
      stored: {
        quantity: { unit: 'GB', value: 250 },
        totalPrice: 10.25,
      },
      totalPrice: 15.75,
      region: 'US-WEST-2',
    },
  ],
  snapshots: [
    {
      instance: {
        quantity: { unit: 'Snapshot', value: 5 },
        totalPrice: 2.5,
      },
      volume: 'vol-snapshot-001',
      totalPrice: 7.25,
      region: 'EU-WEST-3',
    },
  ],
  volumes: [
    {
      volumeId: 'vol-data-001',
      quantity: {
        unit: 'GB',
        value: 1000,
      },
      totalPrice: 45.0,
      type: 'SSD',
      region: 'US-EAST-1',
    },
  ],
  bandwidthByRegions: [
    {
      region: 'GLOBAL',
      outgoingBandwidth: {
        quantity: { unit: 'GB', value: 5000 },
        totalPrice: 50.0,
      },
      totalPrice: 50.0,
    },
  ],
  privateRegistry: [
    {
      name: 'private-registry-01',
      quantity: { unit: 'Hour', value: 720 },
      totalPrice: 36.0,
      region: 'EU-WEST-2',
    },
  ],
  kubernetesLoadBalancer: [
    {
      name: 'k8s-lb-01',
      quantity: { unit: 'Hour', value: 480 },
      totalPrice: 24.0,
      region: 'US-WEST-1',
    },
  ],
  notebooks: [
    {
      name: 'data-science-notebook',
      quantity: { unit: 'Hour', value: 360 },
      totalPrice: 180.0,
      region: 'EU-NORTH-1',
    },
  ],
  serving: [
    {
      name: 'ml-serving-01',
      quantity: { unit: 'Hour', value: 240 },
      totalPrice: 120.0,
      region: 'US-CENTRAL-1',
    },
  ],
  training: [
    {
      name: 'gpu-training-cluster',
      quantity: { unit: 'Hour', value: 300 },
      totalPrice: 450.0,
      region: 'EU-WEST-4',
    },
  ],
  dataProcessing: [
    {
      name: 'batch-processing-job',
      quantity: { unit: 'Job', value: 50 },
      totalPrice: 75.5,
      region: 'US-EAST-3',
    },
  ],
  databases: [
    {
      name: 'postgres-db-cluster',
      quantity: { unit: 'Hour', value: 720 },
      totalPrice: 360.0,
      region: 'EU-SOUTH-1',
    },
  ],
  coldArchive: [
    {
      name: 'long-term-archive',
      quantity: { unit: 'GB', value: 10000 },
      totalPrice: 100.0,
      region: 'US-WEST-3',
    },
  ],
  floatingIP: [
    {
      name: 'frontend-floating-ip',
      quantity: { unit: 'Hour', value: 720 },
      totalPrice: 18.0,
      region: 'EU-WEST-1',
    },
  ],
  gateway: [
    {
      name: 'network-gateway',
      quantity: { unit: 'Hour', value: 720 },
      totalPrice: 36.0,
      region: 'US-EAST-4',
    },
  ],
  octaviaLoadBalancer: [
    {
      name: 'web-lb-cluster',
      quantity: { unit: 'Hour', value: 480 },
      totalPrice: 96.0,
      region: 'EU-CENTRAL-2',
    },
  ],
  aiDeploy: [
    {
      name: 'ai-model-deployment',
      quantity: { unit: 'Hour', value: 240 },
      totalPrice: 180.0,
      region: 'US-WEST-2',
    },
  ],
  publicIP: [
    {
      name: 'public-api-endpoint',
      quantity: { unit: 'Hour', value: 720 },
      totalPrice: 12.0,
      region: 'EU-WEST-5',
    },
  ],
  totals: {
    hourly: {
      total: 1870.25,
      privateRegistry: 36.0,
      kubernetesLoadBalancer: 24.0,
      notebooks: 180.0,
      serving: 120.0,
      training: 450.0,
      dataProcessing: 75.5,
      databases: 360.0,
      coldArchive: 100.0,
      floatingIP: 18.0,
      gateway: 36.0,
      octaviaLoadBalancer: 96.0,
      aiDeploy: 180.0,
      publicIP: 12.0,
      instance: 12.5,
      objectStorage: 35.5,
      archiveStorage: 15.75,
      snapshot: 7.25,
      volume: 45.0,
      bandwidth: 50.0,
    },
    monthly: {
      total: 275.75,
      instance: 275.75,
    },
    total: 2146.0,
  },
};

describe('Consumption', () => {
  it('matches snapshot when is Pending true', () => {
    vi.spyOn(_useConsumptionHook, 'useGeTCurrentUsage').mockReturnValue({
      data: undefined,
      isPending: true,
    } as UseQueryResult<_useConsumptionHook.TConsumptionDetail, Error>);

    const { asFragment } = render(<Consumption />, {
      wrapper,
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot when data exist', async () => {
    vi.spyOn(_useConsumptionHook, 'useGeTCurrentUsage').mockReturnValue({
      data: mockedConsumption,
      isPending: false,
    } as UseQueryResult<_useConsumptionHook.TConsumptionDetail, Error>);

    const { asFragment } = render(<Consumption />, {
      wrapper,
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
