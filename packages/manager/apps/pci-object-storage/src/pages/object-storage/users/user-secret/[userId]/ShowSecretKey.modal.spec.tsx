import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as userAPI from '@/data/api/user/user.api';
import UserSecret from './ShowSecretKey.modal';
import {
  mockedCloudUser,
  mockedS3CredentialsSecretOnly,
  mockedS3CredentialsWithoutPwd,
} from '@/__tests__/helpers/mocks/cloudUser/user';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';

vi.mock(
  '@/pages/object-storage/ObjectStorage.context',
  () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
  })),
  }),
);

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({
      projectId: 'projectId',
      userId: '12',
    }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@/data/api/user/user.api', () => ({
  getUserS3Credentials: vi.fn(() => [mockedS3CredentialsWithoutPwd]),
  getUserSecretKey: vi.fn(() => [mockedS3CredentialsSecretOnly]),
}));

describe('Show Secret Key', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders ShowSecretKey Modal', async () => {
    render(<UserSecret />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('get-user-secret-modal')).toBeTruthy();
      expect(
        screen.getByText(mockedS3CredentialsWithoutPwd.access),
      ).toBeTruthy();
    });
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(userAPI.getUserSecretKey).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<UserSecret />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(userAPI.getUserSecretKey).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'getUserSecretToastErrorTitle',
        variant: 'critical',
        description: 'The provided data is invalid',
      });
    });
  });
});
