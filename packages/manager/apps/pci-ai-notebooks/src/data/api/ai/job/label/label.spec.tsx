import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { editLabel } from './label.api';
import { mockedLabel } from '@/__tests__/helpers/mocks/shared/label';

vi.mock('@ovh-ux/manager-core-api', () => {
  const put = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        put,
      },
    },
  };
});

describe('label functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call editLabel with labelInput', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await editLabel({
      projectId: 'projectId',
      jobId: 'jobId',
      label: mockedLabel,
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/job/jobId/label',
      mockedLabel,
    );
  });
});
