import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFormatDiskDisplay } from './useFormatDiskDisplay';
import { TDiskViewModel } from '../view-models/mappers/diskMapper';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useBytes: () => ({
    formatBytes: (bytes: number) => `${bytes} B`,
  }),
}));

describe('useFormatDiskDisplay', () => {
  it('returns display for no-disk placeholder', () => {
    const noDisk: TDiskViewModel = {
      id: 'no-disk',
      display: '-',
      number: 0,
      capacityValue: 0,
      capacityUnit: 'gb',
      interface: null,
    };
    const { result } = renderHook(() => useFormatDiskDisplay(noDisk));
    expect(result.current).toBe('-');
  });

  it('returns formatted string for real disk using formatBytes', () => {
    const disk: TDiskViewModel = {
      id: '1_50_GB_no-interface_0',
      number: 1,
      capacityValue: 50,
      capacityUnit: 'gb',
      interface: 'NVMe',
    };
    const { result } = renderHook(() => useFormatDiskDisplay(disk));
    expect(result.current).toContain('1x');
    expect(result.current).toContain('NVMe');
  });
});
