import { describe, expect, vi } from 'vitest';
import { useMatches } from 'react-router-dom';
import { useOverridePage } from '../useOverridePage';
import '@testing-library/jest-dom';

describe('useOverridePage', () => {
  it('should return false', async () => {
    vi.mocked(useMatches).mockReturnValue([]);
    expect(useOverridePage()).toBeFalsy();
  });

  it('should return false', async () => {
    vi.mocked(useMatches).mockReturnValue([
      { handle: { isOverridePage: false } },
    ] as never);
    expect(useOverridePage()).toBeFalsy();
  });

  it('should return false', async () => {
    vi.mocked(useMatches).mockReturnValue([
      { handle: { isOverridePage: true } },
    ] as never);
    expect(useOverridePage()).toBeTruthy();
  });
});
