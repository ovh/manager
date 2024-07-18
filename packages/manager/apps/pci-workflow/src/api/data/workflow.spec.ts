import { describe, expect, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { deleteWorkflow } from './workflow';

vi.mock('@ovh-ux/manager-core-api');
const mockedAxios = vi.mocked(v6.delete);

describe('deleteWorkflow', () => {
  it('successfully deletes a workflow', async () => {
    const mockResponse = { success: true };
    vi.mocked(v6.delete).mockResolvedValue({ data: mockResponse });

    const response = await deleteWorkflow('project1', 'region1', 'workflow1');

    expect(response).toEqual(mockResponse);
    expect(v6.delete).toHaveBeenCalledWith(
      '/cloud/project/project1/region/region1/workflow/backup/workflow1',
    );
  });

  it('throws an error when the API call fails', async () => {
    const errorMessage = 'API call failed';
    vi.mocked(v6.delete).mockRejectedValue(new Error(errorMessage));

    await expect(
      deleteWorkflow('project1', 'region1', 'workflow1'),
    ).rejects.toThrow(errorMessage);
  });
});
