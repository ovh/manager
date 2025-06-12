import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { editLabel } from './label.api';
import { mockedLabel } from '@/__tests__/helpers/mocks/shared/label';

describe('label functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call editLabel with labelInput', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await editLabel({
      projectId: 'projectId',
      appId: 'appId',
      label: mockedLabel,
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app/appId/label',
      mockedLabel,
    );
  });
});
