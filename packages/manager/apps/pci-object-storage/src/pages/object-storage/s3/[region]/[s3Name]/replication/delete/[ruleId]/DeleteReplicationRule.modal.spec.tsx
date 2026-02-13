import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import * as replicationApi from '@/data/api/replication/replication.api';
import DeleteReplication from './DeleteReplicationRule.modal';
import { mockedS3WithReplication } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';

vi.mock('react-i18next', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-i18next')>();
  return {
    ...mod,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

vi.mock(
  '@/pages/object-storage/s3/[region]/[s3Name]/S3.context',
  () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedS3WithReplication,
    s3Query: { isLoading: false },
  })),
  }),
);

vi.mock('@/data/api/replication/replication.api', () => ({
  updateReplications: vi.fn(),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Storage: vi.fn(() => mockedS3WithReplication),
}));

describe('Delete Replication', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({ projectId: 'projectId', ruleId: 'rule-1' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Delete User Modal', async () => {
    render(<DeleteReplication />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('delete-replication-modal')).toBeTruthy();
      expect(
        screen.getByTestId('delete-replication-confirm-button'),
      ).toBeTruthy();
    });
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(replicationApi.updateReplications).mockImplementation(() => {
      throw mockedObjStoError;
    });

    render(<DeleteReplication />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(screen.getByTestId('delete-replication-confirm-button'));
    });

    await waitFor(() => {
      expect(replicationApi.updateReplications).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        description: 'deleteReplicationToastErrorMessage',
        title: 'deleteReplicationToastErrorTitle',
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<DeleteReplication />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(screen.getByTestId('delete-replication-confirm-button'));
    });

    await waitFor(() => {
      expect(replicationApi.updateReplications).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteReplicationToastSuccessTitle',
        description: 'deleteReplicationToastSuccessMessage',
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith('../');
    });
  });
});
