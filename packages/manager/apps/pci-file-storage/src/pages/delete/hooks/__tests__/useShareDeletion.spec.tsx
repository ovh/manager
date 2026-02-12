import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDeleteShare } from '@/data/hooks/shares/useDeleteShare';

import { useShareDeletion } from '../useShareDeletion';

vi.mock('@/data/hooks/shares/useDeleteShare');

const mockUseDeleteShare = vi.mocked(useDeleteShare);

describe('useShareDeletion', () => {
  const projectId = 'project-1';
  const region = 'GRA9';
  const shareId = 'share-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDeleteShare.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteShare>);
  });

  describe('useShareDeletion', () => {
    it('returns deleteShare and isPending from useDeleteShare', () => {
      const mockMutate = vi.fn();
      mockUseDeleteShare.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      } as unknown as ReturnType<typeof useDeleteShare>);

      const { result } = renderHook(() =>
        useShareDeletion(projectId, region, shareId, {
          onSuccess: vi.fn(),
          onError: vi.fn(),
        }),
      );

      expect(result.current.deleteShare).toBe(mockMutate);
      expect(result.current.isPending).toBe(true);
    });

    it('calls useDeleteShare with projectId, region, shareId and callbacks', () => {
      renderHook(() =>
        useShareDeletion(projectId, region, shareId, {
          onSuccess: vi.fn(),
          onError: vi.fn(),
        }),
      );

      expect(mockUseDeleteShare).toHaveBeenCalledWith(
        projectId,
        region,
        shareId,
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      );
    });

    it('calls onError with API message when mutation onError receives axios error with message', async () => {
      const onError = vi.fn();
      let capturedOnError: ((error: Error) => void) | undefined;

      mockUseDeleteShare.mockImplementation((...args) => {
        const options = args[3];
        capturedOnError = options?.onError;
        return {
          mutate: vi.fn(),
          isPending: false,
        } as unknown as ReturnType<typeof useDeleteShare>;
      });

      renderHook(() => useShareDeletion(projectId, region, shareId, { onError }));

      const apiError = Object.assign(new Error(), {
        isAxiosError: true,
        response: { data: { message: 'Share is in use' } },
      }) as Error & {
        isAxiosError: boolean;
        response: { data: { message: string } };
      };

      capturedOnError?.(apiError);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('Share is in use');
      });
    });

    it('calls onError with error.message when mutation onError receives plain Error', async () => {
      const onError = vi.fn();
      let capturedOnError: ((error: Error) => void) | undefined;

      mockUseDeleteShare.mockImplementation((...args) => {
        const options = args[3];
        capturedOnError = options?.onError;
        return {
          mutate: vi.fn(),
          isPending: false,
        } as unknown as ReturnType<typeof useDeleteShare>;
      });

      renderHook(() => useShareDeletion(projectId, region, shareId, { onError }));

      const plainError = new Error('Network failure');
      capturedOnError?.(plainError);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('Network failure');
      });
    });

    it('calls onError with empty string when error has no message', async () => {
      const onError = vi.fn();
      let capturedOnError: ((error: Error) => void) | undefined;

      mockUseDeleteShare.mockImplementation((...args) => {
        const options = args[3];
        capturedOnError = options?.onError;
        return {
          mutate: vi.fn(),
          isPending: false,
        } as unknown as ReturnType<typeof useDeleteShare>;
      });

      renderHook(() => useShareDeletion(projectId, region, shareId, { onError }));

      const errorWithoutMessage = new Error();
      capturedOnError?.(errorWithoutMessage);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('');
      });
    });

    it('does not throw when onError is not provided and mutation fails', () => {
      let capturedOnError: ((error: Error) => void) | undefined;

      mockUseDeleteShare.mockImplementation((...args) => {
        const options = args[3];
        capturedOnError = options?.onError;
        return {
          mutate: vi.fn(),
          isPending: false,
        } as unknown as ReturnType<typeof useDeleteShare>;
      });

      renderHook(() => useShareDeletion(projectId, region, shareId, {}));

      expect(() => capturedOnError?.(new Error('Some error'))).not.toThrow();
    });

    it('passes onSuccess through to useDeleteShare', () => {
      const onSuccess = vi.fn();

      renderHook(() =>
        useShareDeletion(projectId, region, shareId, {
          onSuccess,
          onError: vi.fn(),
        }),
      );

      expect(mockUseDeleteShare).toHaveBeenCalledWith(
        projectId,
        region,
        shareId,
        expect.objectContaining({
          onSuccess,
        }),
      );
    });
  });
});
