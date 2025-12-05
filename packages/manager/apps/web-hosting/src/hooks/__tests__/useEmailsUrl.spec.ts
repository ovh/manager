import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import { useEmailsUrl } from '../useEmailsUrl';

describe('useEmailsUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the correct hosting URL without path', async () => {
    const { result } = renderHook(() => useEmailsUrl('test-service'), { wrapper });

    await waitFor(() => {
      expect(result.current).toBe('test-url');
    });
  });

  it('should return the correct hosting URL with path', async () => {
    const { result } = renderHook(() => useEmailsUrl('test-service', 'test-path'), { wrapper });

    await waitFor(() => {
      expect(result.current).toBe('test-url');
    });
  });
});
