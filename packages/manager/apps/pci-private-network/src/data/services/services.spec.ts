import { describe, vi } from 'vitest';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { TNetwork, TNetworkCreationResponse } from '@/types/network.type';
import { getNetwork, createPrivateNetwork } from '@/data/api/networks';
import { handleCreatePrivateNetwork } from './services';
import { setOptimisticPrivateNetworks } from '@/data/hooks/networks/useNetworks';

const vlanIdTest = 3000;
const {
  form,
  projectId,
  getCreationStatus,
  operationId,
  assignGateway,
  enableSnatOnGateway,
} = vi.hoisted(() => ({
  form: {
    region: 'RBX-1',
    name: 'test',
    subnet: {
      cidr: '10.1.0.0/16',
      enableDhcp: true,
      enableGatewayIp: true,
      ipVersion: 4,
    },
    defaultVlanId: 1,
    vlanId: 22,
    existingGatewayId: 'testExistingIdGateway',
    gateway: {
      model: 's',
      name: 'gateway1',
    },
  },
  projectId: 'projectId',
  getCreationStatus: vi
    .fn()
    .mockResolvedValue({ resourceId: 'testResourceId' }),
  operationId: 'operationId',
  createPrivateNetwork: vi.fn(),
  assignGateway: vi.fn(),
  enableSnatOnGateway: vi.fn(),
}));

vi.mock('@/data/api/networks');
vi.mocked(getNetwork).mockResolvedValue({ vlanId: vlanIdTest } as TNetwork);
vi.mocked(createPrivateNetwork).mockResolvedValue({
  id: operationId,
} as TNetworkCreationResponse);

vi.mock('@/data/api/gateway', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/data/api/gateway')>();

  return {
    ...original,
    enableSnatOnGateway,
    assignGateway,
  };
});

vi.mock('@/data/hooks/networks/useNetworks');

describe('Create Private Network', () => {
  it('should not post gateway and vlanId when region is LZ', async () => {
    const values: NewPrivateNetworkForm = { ...form, isLocalZone: true };
    const { name, subnet, region } = values;

    await handleCreatePrivateNetwork(values, projectId, getCreationStatus);

    expect(createPrivateNetwork).toHaveBeenCalledWith({
      projectId,
      region,
      data: {
        name,
        subnet,
      },
    });

    expect(getCreationStatus).toHaveBeenCalledWith({ projectId, operationId });
  });

  it('post private network params with gateway and vlanId when region is not LZ', async () => {
    const { name, vlanId, subnet, region, gateway } = form;

    await handleCreatePrivateNetwork(form, projectId, getCreationStatus);

    expect(createPrivateNetwork).toHaveBeenCalledWith({
      projectId,
      region,
      data: {
        name,
        vlanId,
        subnet,
        gateway,
      },
    });

    expect(getCreationStatus).toHaveBeenCalledWith({ projectId, operationId });
    expect(setOptimisticPrivateNetworks).toHaveBeenCalledWith(projectId, {
      id: 'testResourceId',
      name,
      region,
      visibility: 'private',
      vlanId,
    });
  });

  it('should enable snat', async () => {
    const values: NewPrivateNetworkForm = { ...form, enableSnat: true };
    const { region, existingGatewayId } = values;

    await handleCreatePrivateNetwork(values, projectId, getCreationStatus);

    expect(enableSnatOnGateway).toHaveBeenCalledWith(
      projectId,
      region,
      existingGatewayId,
    );
  });

  it('should assign gateway when gateway already exists', async () => {
    const { region, existingGatewayId } = form;

    await handleCreatePrivateNetwork(form, projectId, getCreationStatus);

    expect(assignGateway).toHaveBeenCalledWith(
      projectId,
      region,
      'testResourceId',
      existingGatewayId,
    );
  });

  it('should call getNetwork and setOptimisticPrivateNetworks when region is not LZ and vlanId not defined by user', async () => {
    const { vlanId, ...values } = form;

    await handleCreatePrivateNetwork(values, projectId, getCreationStatus);

    expect(getNetwork).toHaveBeenCalledWith(
      projectId,
      values.region,
      'testResourceId',
    );

    expect(setOptimisticPrivateNetworks).toHaveBeenCalledWith(projectId, {
      id: 'testResourceId',
      name: values.name,
      region: values.region,
      visibility: 'private',
      vlanId: vlanIdTest,
    });
  });
});
