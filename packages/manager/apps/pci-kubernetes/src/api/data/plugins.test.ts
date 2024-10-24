import { v6 } from '@ovh-ux/manager-core-api';
import { vi } from 'vitest';
import { updateAdmissionPlugin } from './plugins';

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
