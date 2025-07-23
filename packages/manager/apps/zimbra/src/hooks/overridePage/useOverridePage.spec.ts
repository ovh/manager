import { useMatches } from 'react-router-dom';

import '@testing-library/jest-dom';
import { describe, expect, vi } from 'vitest';

import { useOverridePage } from '@/hooks';

describe('useOverridePage', () => {
  it('should return false', () => {
    vi.mocked(useMatches).mockReturnValue([{ handle: { isOverridePage: false } }] as never);
    expect(useOverridePage()).toBeFalsy();
  });

  it('should return true', () => {
    vi.mocked(useMatches).mockReturnValue([{ handle: { isOverridePage: true } }] as never);
    expect(useOverridePage()).toBeTruthy();
  });
});
