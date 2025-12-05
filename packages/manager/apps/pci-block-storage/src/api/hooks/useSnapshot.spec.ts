import { describe, expect, it, vi } from 'vitest';
import { act } from '@testing-library/react';
import { deleteSnapshots } from '@/api/data/snapshot';
import { useDeleteVolumeSnapshots } from '@/api/hooks/useSnapshot';
import { renderHookWithMockedWrappers } from '@/__tests__/renderWithMockedWrappers';
import { useVolume } from '@/api/hooks/useVolume';
import { getOperation, TOperationStatus } from '@/api/data/operation';

vi.mock('react-router-dom');

vi.mock('@/api/hooks/useVolume');
vi.mocked(useVolume).mockReturnValue({
  data: { region: 'volumeRegion' },
} as ReturnType<typeof useVolume>);
vi.mock('@/api/data/snapshot');
vi.mock('@/api/data/operation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/data/operation')>();
  return {
    ...actual,
    getOperation: vi.fn(),
  };
});

const PROJECT_ID = '1';
const VOLUME_ID = 'v1';

describe('useSnapshots', () => {
  describe('useDeleteVolumeSnapshots', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.mocked(getOperation).mockClear();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it.each([
      {
        description: 'delete snapshots failed',
        deleteSnapshotResponse: {
          error: new Error('delete error'),
        },
        getOperationResponse: null,
        expectedError: true,
      },
      {
        description: 'delete snapshots return failed operation',
        deleteSnapshotResponse: {
          data: {
            id: 'operationId',
            status: TOperationStatus.IN_ERROR,
          },
        },
        getOperationResponse: null,
        expectedError: true,
      },
      {
        description: 'fetch operation failed',
        deleteSnapshotResponse: {
          data: {
            id: 'operationId',
            status: TOperationStatus.IN_PROGRESS,
          },
        },
        getOperationResponse: {
          error: new Error('fetch error'),
        },
        expectedError: true,
      },
      {
        description: 'fetch first operation has a failed state',
        deleteSnapshotResponse: {
          data: {
            id: 'operationId',
            status: TOperationStatus.IN_PROGRESS,
          },
        },
        getOperationResponse: {
          data: [
            {
              id: 'operationId',
              status: TOperationStatus.IN_ERROR,
            },
          ],
        },
        expectedError: true,
      },
      {
        description: 'fetch third operation has a failed state',
        deleteSnapshotResponse: {
          data: {
            id: 'operationId',
            status: TOperationStatus.IN_PROGRESS,
          },
        },
        getOperationResponse: {
          data: [
            {
              id: 'operationId',
              status: TOperationStatus.IN_PROGRESS,
            },
            {
              id: 'operationId',
              status: TOperationStatus.IN_PROGRESS,
            },
            {
              id: 'operationId',
              status: TOperationStatus.IN_ERROR,
            },
          ],
        },
        expectedError: true,
      },
      {
        description: 'number of tries is exceeded',
        deleteSnapshotResponse: {
          data: {
            id: 'operationId',
            status: TOperationStatus.IN_PROGRESS,
          },
        },
        getOperationResponse: {
          data: new Array(10).fill({
            id: 'operationId',
            status: TOperationStatus.IN_PROGRESS,
          }),
        },
        expectedError: true,
      },
      {
        description: 'operation is completed after delete snapshots',
        deleteSnapshotResponse: {
          data: {
            id: 'operationId',
            status: TOperationStatus.COMPLETED,
          },
        },
        getOperationResponse: null,
        expectedError: false,
      },
      {
        description: 'operation is completed after 6 operation calls',
        deleteSnapshotResponse: {
          data: {
            id: 'operationId',
            status: TOperationStatus.IN_PROGRESS,
          },
        },
        getOperationResponse: {
          data: (() => {
            const reponses = new Array(5).fill({
              id: 'operationId',
              status: TOperationStatus.IN_PROGRESS,
            });
            reponses.push({
              id: 'operationId',
              status: TOperationStatus.COMPLETED,
            });
            return reponses;
          })(),
        },
        expectedError: false,
      },
    ])(
      'should return error $expectedError when $description',
      async ({
        deleteSnapshotResponse,
        getOperationResponse,
        expectedError,
      }) => {
        // GIVEN
        if (deleteSnapshotResponse.error) {
          vi.mocked(deleteSnapshots).mockRejectedValue(
            deleteSnapshotResponse.error,
          );
        }
        if (deleteSnapshotResponse.data) {
          vi.mocked(deleteSnapshots).mockResolvedValue(
            deleteSnapshotResponse.data,
          );
        }

        if (!!getOperationResponse && getOperationResponse.error) {
          vi.mocked(getOperation).mockRejectedValue(getOperationResponse.error);
        }
        if (!!getOperationResponse && getOperationResponse.data) {
          getOperationResponse.data.forEach((operation) => {
            vi.mocked(getOperation).mockResolvedValueOnce(operation);
          });
        }

        const { result } = renderHookWithMockedWrappers(() =>
          useDeleteVolumeSnapshots({
            projectId: PROJECT_ID,
            volumeId: VOLUME_ID,
          }),
        );

        // WHEN
        await act(async () => result.current.deleteVolumeSnapshots());
        await vi.advanceTimersByTimeAsync(10000);

        // THEN
        expect(result.current.isError).toBe(expectedError);
        expect(result.current.isPending).toBe(false);
        if (!getOperationResponse) expect(getOperation).not.toHaveBeenCalled();
        if (getOperationResponse && getOperationResponse.error)
          expect(getOperation).toHaveBeenCalledTimes(1);
        if (getOperationResponse && getOperationResponse.data)
          expect(getOperation).toHaveBeenCalledTimes(
            getOperationResponse.data.length,
          );
      },
    );
  });
});
