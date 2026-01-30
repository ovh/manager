import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useShareColumn } from '../useShareColumn';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@ovh-ux/muk', () => ({
  useBytes: () => ({
    formatBytes: (bytes: number) => `${bytes} B`,
  }),
  DatagridColumn: () => null,
}));

describe('useShareColumn', () => {
  it('should return an array of column definitions', () => {
    const { result } = renderHook(() => useShareColumn());

    const columns = result.current ?? [];
    expect(columns).toHaveLength(5);
    expect(columns[0]!.id).toBe('name_id');
    expect(columns[1]!.id).toBe('region');
    expect(columns[2]!.id).toBe('protocol');
    expect(columns[3]!.id).toBe('allocated_capacity');
    expect(columns[4]!.id).toBe('status');
  });
});
