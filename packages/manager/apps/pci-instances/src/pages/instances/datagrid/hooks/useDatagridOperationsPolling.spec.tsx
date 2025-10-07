import { beforeEach, describe, expect, vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import { getOperations } from '@/data/api/operation';
import { TOperation } from '@/types/operation/entity.type';
import { useDatagridOperationsPolling } from '@/pages/instances/datagrid/hooks/useDatagridOperationsPolling';
import { renderHookWithQueryClient } from '@/__tests__/hooks/renderHookWithQueryClient';
import { useProjectId } from '@/hooks/project/useProjectId';

vi.mock('@/data/api/operation');
vi.mock('@/hooks/project/useProjectId');

vi.mocked(useProjectId).mockReturnValue(Math.random().toString());

const mockOnComplete = vi.fn();

describe('useDatagridOperationsPolling', () => {
  beforeEach(() => {
    vi.mocked(getOperations).mockClear();
  });

  describe('should return no operation and not call onComplete', () => {
    it.each([
      {
        description: 'with no operation',
        operations: [],
      },
      {
        description: 'with a completed instance creation',
        operations: [
          {
            section: 'instance',
            action: 'create',
            status: 'completed',
          },
        ],
      },
      {
        description: 'with a completed instance reinstall',
        operations: [
          {
            section: 'instance',
            action: 'reinstall',
            status: 'completed',
          },
        ],
      },
      {
        description:
          'with a in-progress instance creation without copy in-progress',
        operations: [
          {
            section: 'instance',
            action: 'create',
            status: 'in-progress',
            subOperations: [
              { section: 'instance', action: 'create', status: 'in-progress' },
              { section: 'image', action: 'copytoregion', status: 'completed' },
            ],
          },
        ],
      },
      {
        description: 'with a in-progress instance creation with copy completed',
        operations: [
          {
            section: 'instance',
            action: 'create',
            status: 'in-progress',
            subOperations: [
              { section: 'instance', action: 'create', status: 'in-progress' },
            ],
          },
        ],
      },
      {
        description:
          'with in-progress instance reinstall without copy in-progress',
        operations: [
          {
            section: 'instance',
            action: 'reinstall',
            status: 'in-progress',
            subOperations: [
              { section: 'image', action: 'copytoregion', status: 'completed' },
            ],
          },
        ],
      },
    ])('$description', async ({ operations }) => {
      vi.mocked(getOperations).mockResolvedValueOnce(
        operations as TOperation[],
      );

      const { result } = renderHookWithQueryClient(() =>
        useDatagridOperationsPolling(mockOnComplete),
      );

      await waitFor(() => {
        expect(result.current.hasOperationsRunning).toBe(false);
        expect(getOperations).toHaveBeenCalledTimes(1);
        expect(mockOnComplete).not.toHaveBeenCalled();
      });
    });
  });

  describe('should return operation in progress and not call onComplete', () => {
    it.each([
      {
        description: 'with instance creation with copy in-progress',
        operations: [
          {
            section: 'instance',
            action: 'create',
            status: 'in-progress',
            subOperations: [
              {
                section: 'image',
                action: 'copytoregion',
                status: 'in-progress',
              },
            ],
          },
        ],
      },
      {
        description: 'with instance reinstall with copy in-progress',
        operations: [
          {
            section: 'instance',
            action: 'reinstall',
            status: 'in-progress',
            subOperations: [
              {
                section: 'image',
                action: 'copytoregion',
                status: 'in-progress',
              },
            ],
          },
        ],
      },
      {
        description: 'with instance creation without copy',
        operations: [
          {
            section: 'instance',
            action: 'create',
            status: 'in-progress',
            subOperations: [
              {
                section: 'instance',
                action: 'create',
                status: 'in-progress',
              },
            ],
          },
        ],
      },
    ])('$description', async ({ operations }) => {
      vi.mocked(getOperations).mockResolvedValueOnce(
        operations as TOperation[],
      );

      const { result } = renderHookWithQueryClient(() =>
        useDatagridOperationsPolling(mockOnComplete),
      );

      await waitFor(() => {
        expect(result.current.hasOperationsRunning).toBe(true);
        expect(getOperations).toHaveBeenCalledTimes(1);
        expect(mockOnComplete).not.toHaveBeenCalled();
      });
    });
  });

  describe('should recall getOperations and call onComplete', () => {
    it.each([
      {
        firstCallDescription:
          'with first instance creation with copy in-progress',
        firstOperations: [
          {
            section: 'instance',
            action: 'create',
            status: 'in-progress',
            subOperations: [
              {
                section: 'image',
                action: 'copytoregion',
                status: 'in-progress',
              },
            ],
          },
        ],
        secondCallDescription: 'with then copy completed',
        secondOperations: [
          {
            section: 'instance',
            action: 'create',
            status: 'in-progress',
            subOperations: [
              {
                section: 'image',
                action: 'copytoregion',
                status: 'completed',
              },
            ],
          },
        ],
      },
      {
        firstCallDescription:
          'with first instance reinstall with copy in-progress',
        firstOperations: [
          {
            section: 'instance',
            action: 'reinstall',
            status: 'in-progress',
            subOperations: [
              {
                section: 'image',
                action: 'copytoregion',
                status: 'in-progress',
              },
            ],
          },
        ],
        secondCallDescription: 'with then copy completed',
        secondOperations: [
          {
            section: 'instance',
            action: 'reinstall',
            status: 'in-progress',
            subOperations: [
              {
                section: 'image',
                action: 'copytoregion',
                status: 'completed',
              },
            ],
          },
        ],
      },
      {
        firstCallDescription:
          'with first instance creation in-progress without copy',
        firstOperations: [
          {
            section: 'instance',
            action: 'create',
            status: 'in-progress',
            subOperations: [
              {
                section: 'instance',
                action: 'create',
                status: 'in-progress',
              },
            ],
          },
        ],
        secondCallDescription: 'with then creation completed completed',
        secondOperations: [
          {
            section: 'instance',
            action: 'create',
            status: 'completed',
            subOperations: [
              {
                section: 'instance',
                action: 'create',
                status: 'completed',
              },
            ],
          },
        ],
      },
    ])(
      '$firstCallDescription $secondCallDescription',
      async ({ firstOperations, secondOperations }) => {
        vi.mocked(getOperations)
          .mockResolvedValueOnce(firstOperations as TOperation[])
          .mockResolvedValueOnce(secondOperations as TOperation[]);

        const { result } = renderHookWithQueryClient(() =>
          useDatagridOperationsPolling(mockOnComplete),
        );

        await waitFor(() => {
          expect(getOperations).toHaveBeenCalledTimes(1);
        });

        await waitFor(async () => {
          vi.useFakeTimers();
          await vi.advanceTimersToNextTimerAsync();
          vi.useRealTimers();
        });

        await waitFor(() => {
          expect(getOperations).toHaveBeenCalledTimes(2);
          expect(result.current.hasOperationsRunning).toBe(false);
          expect(mockOnComplete).toHaveBeenCalled();
        });
      },
    );
  });
});
