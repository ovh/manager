import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { mockedTokenCreation } from '@/__tests__/helpers/mocks/shared/token';
import {
  addToken,
  deleteToken,
  getToken,
  getTokens,
  renewToken,
} from '@/data/api/ai/token/token.api';

describe('Token functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getTokens', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getTokens({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/token',
    );
  });

  it('should call getToken', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getToken({
      projectId: 'projectId',
      tokenId: 'tokenId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/token/tokenId',
    );
  });

  it('should call addToken with mockedTockenCreation', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addToken({
      projectId: 'projectId',
      token: mockedTokenCreation,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/token',
      mockedTokenCreation,
    );
  });

  it('should call deleteToken with tokenID', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteToken({
      projectId: 'projectId',
      tokenId: 'tokenId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/token/tokenId',
    );
  });

  it('should call renewToken with tokenId', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await renewToken({
      projectId: 'projectId',
      tokenId: 'tokenId',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/token/tokenId/renew',
    );
  });
});
