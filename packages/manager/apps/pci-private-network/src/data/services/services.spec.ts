import { describe, vi } from 'vitest';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { TNetworkCreationResponse } from '@/types/network.type';
import { createPrivateNetwork as apiCreatePrivateNetwork } from '@/data/api/networks';
import { enableSnatOnGateway, assignGateway } from '@/data/api/gateway';
import { fetchCheckPrivateNetworkCreationStatus } from '@/data/hooks/networks/useNetworks';
import { createPrivateNetwork } from './services';
import { privateNetworkForm as form, projectId } from '@/__mocks__/network';

const operationId = 'operationId';

vi.mock('@/data/api/networks');
vi.mocked(apiCreatePrivateNetwork).mockResolvedValue({
  id: operationId,
} as TNetworkCreationResponse);

vi.mock('@/data/api/gateway');

vi.mock('@/data/hooks/networks/useNetworks');
vi.mocked(fetchCheckPrivateNetworkCreationStatus).mockResolvedValue({
  resourceId: 'testResourceId',
} as TNetworkCreationResponse);

describe('Create Private Network', () => {
  it('should not post gateway and vlanId when region is LZ', async () => {
    const values: NewPrivateNetworkForm = { ...form, isLocalZone: true };
    const { name, subnet, region } = values;

    await createPrivateNetwork(values, projectId);

    expect(apiCreatePrivateNetwork).toHaveBeenCalledWith({
      projectId,
      region,
      data: {
        name,
        subnet,
      },
    });

    expect(fetchCheckPrivateNetworkCreationStatus).toHaveBeenCalledWith(
      projectId,
      operationId,
    );
  });

  it('post private network params with gateway and vlanId when region is not LZ', async () => {
    const { name, vlanId, subnet, region, gateway } = form;

    await createPrivateNetwork(form, projectId);

    expect(apiCreatePrivateNetwork).toHaveBeenCalledWith({
      projectId,
      region,
      data: {
        name,
        vlanId,
        subnet,
        gateway,
      },
    });

    expect(fetchCheckPrivateNetworkCreationStatus).toHaveBeenCalledWith(
      projectId,
      operationId,
    );
  });

  it('should enable snat', async () => {
    const values: NewPrivateNetworkForm = { ...form, enableSnat: true };
    const { region, existingGatewayId } = values;

    await createPrivateNetwork(values, projectId);

    expect(enableSnatOnGateway).toHaveBeenCalledWith(
      projectId,
      region,
      existingGatewayId,
    );
  });

  it('should assign gateway when gateway already exists', async () => {
    const { region, existingGatewayId } = form;

    await createPrivateNetwork(form, projectId);

    expect(assignGateway).toHaveBeenCalledWith(
      projectId,
      region,
      'testResourceId',
      existingGatewayId,
    );
  });
});
