import { v6 } from '@ovh-ux/manager-core-api';
import { vi } from 'vitest';
import { updateAdmissionPlugin, mapPluginsFromArrayToObject } from './plugins';

describe('updateAdmissionPlugin', () => {
  it('calls v6.put with the correct parameters', async () => {
    const projectId = 'project-id';
    const kubeId = 'kube-id';
    const customization = {
      apiServer: { admissionPlugins: { enabled: [], disabled: [] } },
    };

    const expectedUrl = `/cloud/project/${projectId}/kube/${kubeId}/customization`;
    vi.mocked(v6.put).mockResolvedValue({ customization });
    await updateAdmissionPlugin({
      projectId,
      kubeId,
      customization,
    });

    expect(v6.put).toHaveBeenCalledWith(expectedUrl, customization);
  });
});

describe('mapAdmissionPlugins', () => {
  it('should map admission plugins correctly', () => {
    const admissionPlugins = {
      enabled: ['NodeRestriction', 'NonExistentPlugin'],
      disabled: ['AlwaysPullImages'],
    };

    const result = mapPluginsFromArrayToObject(admissionPlugins);
    expect(result).toEqual([
      {
        name: 'NonExistentPlugin',
        label: 'NonExistentPlugin',
        state: 'enabled',
        tip: null,
        value: 'NonExistentPlugin',
        disabled: false,
      },
      {
        name: 'AlwaysPullImages',
        label: 'Plugin Always Pull Images',
        state: 'disabled',
        tip:
          'kube_service_cluster_admission_plugins_always_pull_image_explanation',
        value: 'pull',
        disabled: false,
      },
      {
        name: 'NodeRestriction',
        label: 'Plugin Node Restriction',
        state: 'enabled',
        tip:
          'kube_service_cluster_admission_plugins_node_restriction_explanation',
        value: 'node',
        disabled: true,
      },
    ]);
  });

  it('should handle empty admission plugins', () => {
    const admissionPlugins = {
      enabled: [],
      disabled: [],
    };

    const result = mapPluginsFromArrayToObject(admissionPlugins);
    expect(result).toEqual([]);
  });
});
