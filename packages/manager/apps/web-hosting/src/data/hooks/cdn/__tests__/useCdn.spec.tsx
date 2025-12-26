import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CdnOption, CdnOptionType, PatternType, TCdnOptions } from '@/data/types/product/cdn';
import { wrapper } from '@/utils/test.provider';

import {
  useCreateCdnOption,
  useDeleteCdnOption,
  useUpdateCdnOption,
  useUpdateCdnOptions,
} from '../useCdn';

const mockCdnOption: CdnOption = {
  config: {
    patternType: PatternType.EXTENSION,
    priority: 1,
    ttl: 3600,
  },
  enabled: true,
  pattern: '/test/*',
  type: CdnOptionType.BROTLI,
};

const mockCdnOptions: TCdnOptions = {
  cdnOptions: [mockCdnOption],
};

describe('useCreateCdnOption', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a CDN option and invalidate queries on success', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateCdnOption('serviceName', 'domain', onSuccess), {
      wrapper,
    });

    await result.current.createCdnOptionAsync({
      option: 'testOption',
      cdnOption: mockCdnOption,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('useUpdateCdnOption', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update a CDN option and invalidate queries on success', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useUpdateCdnOption('serviceName', 'domain', onSuccess), {
      wrapper,
    });

    await result.current.updateCdnOptionAsync({
      option: 'testOption',
      cdnOption: mockCdnOption,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('useUpdateCdnOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update CDN options and invalidate queries on success', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useUpdateCdnOptions('serviceName', 'domain', onSuccess), {
      wrapper,
    });

    await result.current.updateCdnOptionsAsync(mockCdnOptions);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('useDeleteCdnOption', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a CDN option and invalidate queries on success', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useDeleteCdnOption('serviceName', 'domain', onSuccess), {
      wrapper,
    });

    result.current.deleteCdnOption('testOption');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});
