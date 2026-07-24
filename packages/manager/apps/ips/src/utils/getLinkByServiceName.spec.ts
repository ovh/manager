import { describe, expect, it, vi } from 'vitest';

import { ClientNavigationApi } from '@ovh-ux/shell/dist/types/plugin/navigation';

import { getLinkByServiceName } from './getLinkByServiceName';

const buildNavigation = () =>
  ({
    getURL: vi.fn((app: string, hash: string) =>
      Promise.resolve(`${app}${hash}`),
    ),
  }) as unknown as ClientNavigationApi;

describe('getLinkByServiceName', () => {
  it('should return "#" when serviceName is missing', async () => {
    const navigation = buildNavigation();
    await expect(
      getLinkByServiceName({ serviceName: undefined, navigation }),
    ).resolves.toBe('#');
    expect(navigation.getURL).not.toHaveBeenCalled();
  });

  it('should build the VCFaaS dashboard link for an "org-" serviceName', async () => {
    const navigation = buildNavigation();
    const link = await getLinkByServiceName({
      serviceName: 'org-abc123',
      navigation,
    });
    expect(navigation.getURL).toHaveBeenCalledWith(
      'hpc-vmware-public-vcf-aas',
      '#/org-abc123',
      {},
    );
    expect(link).toBe('hpc-vmware-public-vcf-aas#/org-abc123');
  });
});
