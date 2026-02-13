import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCreateShare } from '@/data/hooks/shares/useCreateShare';

import { useShareCreation } from '../useShareCreation';

vi.mock('@/data/hooks/shares/useCreateShare');

const mockUseCreateShare = vi.mocked(useCreateShare);

describe('useShareCreation', () => {
  const projectId = 'project-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCreateShare.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useCreateShare>);
  });

  describe('useShareCreation', () => {
    it('returns createShare and isPending from useCreateShare', () => {
      const mockMutate = vi.fn();
      mockUseCreateShare.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      } as unknown as ReturnType<typeof useCreateShare>);

      const { result } = renderHook(() =>
        useShareCreation(projectId, {
          onSuccess: vi.fn(),
          onError: vi.fn(),
        }),
      );

      expect(result.current.createShare).toBe(mockMutate);
      expect(result.current.isPending).toBe(true);
    });

    it('calls useCreateShare with projectId and callbacks', () => {
      renderHook(() =>
        useShareCreation(projectId, {
          onSuccess: vi.fn(),
          onError: vi.fn(),
        }),
      );

      expect(mockUseCreateShare).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId,
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      );
    });

    it('calls onError with API message when mutation onError receives axios error with message', async () => {
      const onError = vi.fn();
      let capturedOnError: ((error: Error) => void) | undefined;

      mockUseCreateShare.mockImplementation(({ onError: onErrorCallback }) => {
        capturedOnError = onErrorCallback;
        return {
          mutate: vi.fn(),
          isPending: false,
        } as unknown as ReturnType<typeof useCreateShare>;
      });

      renderHook(() => useShareCreation(projectId, { onError, onSuccess: vi.fn() }));

      const apiError = Object.assign(new Error(), {
        isAxiosError: true,
        response: { data: { message: 'Share creation failed' } },
      }) as Error & {
        isAxiosError: boolean;
        response: { data: { message: string } };
      };

      capturedOnError?.(apiError);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('Share creation failed');
      });
    });

    it('calls onError with error.message when mutation onError receives plain Error', async () => {
      const onError = vi.fn();
      let capturedOnError: ((error: Error) => void) | undefined;

      mockUseCreateShare.mockImplementation(({ onError: onErrorCallback }) => {
        capturedOnError = onErrorCallback;
        return {
          mutate: vi.fn(),
          isPending: false,
        } as unknown as ReturnType<typeof useCreateShare>;
      });

      renderHook(() => useShareCreation(projectId, { onError, onSuccess: vi.fn() }));

      const plainError = new Error('Network failure');
      capturedOnError?.(plainError);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('Network failure');
      });
    });

    it('calls onError with empty string when error has no message', async () => {
      const onError = vi.fn();
      let capturedOnError: ((error: Error) => void) | undefined;

      mockUseCreateShare.mockImplementation(({ onError: onErrorCallback }) => {
        capturedOnError = onErrorCallback;
        return {
          mutate: vi.fn(),
          isPending: false,
        } as unknown as ReturnType<typeof useCreateShare>;
      });

      renderHook(() => useShareCreation(projectId, { onError, onSuccess: vi.fn() }));

      const errorWithoutMessage = new Error();
      capturedOnError?.(errorWithoutMessage);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('');
      });
    });

    it('does not throw when onError is not provided and mutation fails', () => {
      let capturedOnError: ((error: Error) => void) | undefined;

      mockUseCreateShare.mockImplementation(({ onError: onErrorCallback }) => {
        capturedOnError = onErrorCallback;
        return {
          mutate: vi.fn(),
          isPending: false,
        } as unknown as ReturnType<typeof useCreateShare>;
      });

      renderHook(() => useShareCreation(projectId, { onSuccess: vi.fn(), onError: vi.fn() }));

      expect(() => capturedOnError?.(new Error('Some error'))).not.toThrow();
    });

    it('passes onSuccess through to useCreateShare', () => {
      const onSuccess = vi.fn();

      renderHook(() =>
        useShareCreation(projectId, {
          onSuccess,
          onError: vi.fn(),
        }),
      );

      expect(mockUseCreateShare).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId,
          onSuccess,
        }),
      );
    });
  });
});
