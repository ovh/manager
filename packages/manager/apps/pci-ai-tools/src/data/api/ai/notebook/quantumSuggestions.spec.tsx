import { describe, expect, vi } from 'vitest';
import { getQuantumSuggestions } from './quantumSuggestions.api';
import { NotebookSuggestions } from '@/types/orderFunnel';

vi.mock('@ovh-ux/manager-core-api', () => ({
  apiClient: {
    v6: {
      get: vi.fn().mockResolvedValue({ data: {} as NotebookSuggestions }),
    },
  },
}));

describe('getQuantumSuggestions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getQuantumSuggestions', async () => {
    const { apiClient } = await import('@ovh-ux/manager-core-api');

    expect(apiClient.v6.get).not.toHaveBeenCalled();

    await getQuantumSuggestions({ projectId: 'projectId' }, 'qpu');

    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/suggestion/notebook-quantum/qpu',
    );
  });
});
