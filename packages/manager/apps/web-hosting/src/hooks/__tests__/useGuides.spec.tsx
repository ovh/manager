import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import useGuides from '../useGuides';

describe('useGuides', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return guides with href for FR subsidiary', () => {
    const { result } = renderHook(() => useGuides(), { wrapper });

    expect(result.current.guideLink1).toBeDefined();
    expect(result.current.guideLink1.href).toBeDefined();
    expect(result.current.guideLink2).toBeDefined();
    expect(result.current.guideLink2.href).toBeDefined();
    expect(result.current.guideLink3).toBeDefined();
    expect(result.current.guideLink3.href).toBeDefined();
  });

  it('should return all guide properties', () => {
    const { result } = renderHook(() => useGuides(), { wrapper });

    Object.values(result.current).forEach((guide) => {
      expect(guide).toHaveProperty('title');
      expect(guide).toHaveProperty('description');
      expect(guide).toHaveProperty('category');
      expect(guide).toHaveProperty('urls');
      expect(guide).toHaveProperty('tracking');
      expect(guide).toHaveProperty('href');
    });
  });
});
