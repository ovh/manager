import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications as useMRCNotifications } from '@ovh-ux/manager-react-components';
import { useNotifications } from './useNotifications';

describe('useNotifications', () => {
  const mockAddSuccess = vi.fn();
  const mockAddError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMRCNotifications).mockReturnValue({
      addSuccess: mockAddSuccess,
      addError: mockAddError,
    });
  });

  it('should return addSuccessMessage and addErrorMessage functions', () => {
    const { result } = renderHook(() =>
      useNotifications({ ns: 'test-namespace' }),
    );

    expect(result.current).toHaveProperty('addSuccessMessage');
    expect(result.current).toHaveProperty('addErrorMessage');
    expect(typeof result.current.addSuccessMessage).toBe('function');
    expect(typeof result.current.addErrorMessage).toBe('function');
  });

  it('should call addSuccess with correct parameters when addSuccessMessage is called', () => {
    const { result } = renderHook(() =>
      useNotifications({ ns: 'test-namespace' }),
    );

    const testParams = {
      i18nKey: 'success.key',
      values: { param1: 'value1' },
    };

    result.current.addSuccessMessage(testParams);

    expect(mockAddSuccess).toHaveBeenCalledTimes(1);
    expect(mockAddSuccess).toHaveBeenCalledWith(expect.anything(), true);
  });

  it('should call addError with correct parameters when addErrorMessage is called', () => {
    const { result } = renderHook(() =>
      useNotifications({ ns: 'test-namespace' }),
    );

    const testParams = {
      i18nKey: 'error.key',
      values: { param1: 'value1' },
    };

    result.current.addErrorMessage(testParams);

    expect(mockAddError).toHaveBeenCalledTimes(1);
    expect(mockAddError).toHaveBeenCalledWith(expect.anything(), true);
  });

  it('should handle ApiError with response data message', () => {
    const { result } = renderHook(() =>
      useNotifications({ ns: 'test-namespace' }),
    );

    const apiError = {
      response: {
        data: {
          message: 'API error message',
        },
      },
    } as ApiError;

    result.current.addErrorMessage({
      i18nKey: 'error.api',
      error: apiError,
    });

    expect(mockAddError).toHaveBeenCalledTimes(1);
  });

  it('should handle ApiError with only error message', () => {
    const { result } = renderHook(() =>
      useNotifications({ ns: 'test-namespace' }),
    );

    const apiError = {
      message: 'Simple error message',
    } as ApiError;

    result.current.addErrorMessage({
      i18nKey: 'error.simple',
      error: apiError,
    });

    expect(mockAddError).toHaveBeenCalledTimes(1);
  });

  it('should handle error without any message', () => {
    const { result } = renderHook(() =>
      useNotifications({ ns: 'test-namespace' }),
    );

    const apiError = {} as ApiError;

    result.current.addErrorMessage({
      i18nKey: 'error.nomessage',
      error: apiError,
    });

    expect(mockAddError).toHaveBeenCalledTimes(1);
  });
});
