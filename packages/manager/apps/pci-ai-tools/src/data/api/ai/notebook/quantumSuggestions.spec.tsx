import apiClient from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getQuantumSuggestions } from './quantumSuggestions.api';

describe('logs functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getQuantumSuggestions', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();

    await getQuantumSuggestions({
      projectId: 'projectId',
    });

    expect(apiClient.v6.get).toHaveBeenCalled();
  });
});
