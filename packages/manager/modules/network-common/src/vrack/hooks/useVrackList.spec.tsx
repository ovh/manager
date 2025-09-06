import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import { vi } from 'vitest';

import { vrackListMocks } from '../../mocks';
import { useVrackList } from './useVrackList';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('useVrackList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('should return a list of vracks on success', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { data: vrackListMocks },
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useVrackList());

    expect(result.current.vrackList).toEqual(vrackListMocks);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should return a loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useVrackList());

    expect(result.current.vrackList).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it('should handle an error state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Network error'),
    });

    const { result } = renderHook(() => useVrackList());

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(new Error('Network error'));
  });
});
