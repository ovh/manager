import { describe, vi } from 'vitest';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { TNetworkCreationResponse } from '@/types/network.type';
import { handleCreatePrivateNetwork } from './services';

const {
  form,
  projectId,
  getCreationStatus,
  operationId,
  createPrivateNetwork,
  assignGateway,
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
}));

vi.mock('@/data/api/networks', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/data/api/networks')>();

  return {
    ...original,
    createPrivateNetwork: createPrivateNetwork.mockResolvedValue({
      id: operationId,
    } as TNetworkCreationResponse),
  };
});

vi.mock('@/data/api/gateway', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/data/api/gateway')>();

  return {
    ...original,
    assignGateway,
  };
});

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
});
