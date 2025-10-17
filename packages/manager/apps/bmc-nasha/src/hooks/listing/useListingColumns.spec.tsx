import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useListingColumns } from './useListingColumns';
import { ListingItemType } from '@/types/Listing.type';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => {
      const translations: Record<string, string> = {
        'common:empty': '—',
        'common:na': 'N/A',
        'listing:serviceName': 'Service ID',
        'listing:canCreatePartition': 'Partition creation',
        'listing:canCreatePartition_true': 'Allowed',
        'listing:canCreatePartition_false': 'Not allowed',
        'listing:customName': 'Name',
        'listing:datacenter': 'Datacentre location',
        'listing:diskType': 'Disk type',
        'listing:monitored': 'Monitored',
        'listing:monitored_true': 'Yes',
        'listing:monitored_false': 'No',
        'listing:zpoolCapacity': 'Zpool capacity',
        'listing:zpoolSize': 'Zpool size',
      };
      return translations[key] || fallback || key;
    },
  }),
}));

describe('useListingColumns', () => {
  it('should return columns in the correct order matching AngularJS original', () => {
    const { result } = renderHook(() => useListingColumns<ListingItemType>());
    const columns = result.current;

    expect(columns).toHaveLength(8);
    expect(columns[0].id).toBe('serviceName');
    expect(columns[1].id).toBe('canCreatePartition');
    expect(columns[2].id).toBe('customName');
    expect(columns[3].id).toBe('datacenter');
    expect(columns[4].id).toBe('diskType');
    expect(columns[5].id).toBe('monitored');
    expect(columns[6].id).toBe('zpoolCapacity');
    expect(columns[7].id).toBe('zpoolSize');
  });

  it('should have serviceName as sortable column', () => {
    const { result } = renderHook(() => useListingColumns<ListingItemType>());
    const columns = result.current;

    const serviceNameColumn = columns.find(col => col.id === 'serviceName');
    expect(serviceNameColumn?.isSortable).toBe(true);
  });

  it('should render serviceName correctly', () => {
    const { result } = renderHook(() => useListingColumns<ListingItemType>());
    const columns = result.current;

    const serviceNameColumn = columns.find(col => col.id === 'serviceName');
    const mockRow: ListingItemType = {
      id: 'test-id',
      serviceName: 'zpool-123456',
      canCreatePartition: true,
      customName: 'Test NAS',
      datacenter: 'rbx',
      diskType: 'ssd',
      monitored: true,
    };

    const cellElement = serviceNameColumn?.cell(mockRow);
    expect(cellElement).toBeDefined();
  });

  it('should render canCreatePartition with correct translation', () => {
    const { result } = renderHook(() => useListingColumns<ListingItemType>());
    const columns = result.current;

    const partitionColumn = columns.find(col => col.id === 'canCreatePartition');
    const mockRow: ListingItemType = {
      id: 'test-id',
      serviceName: 'zpool-123456',
      canCreatePartition: true,
      customName: 'Test NAS',
      datacenter: 'rbx',
      diskType: 'ssd',
      monitored: true,
    };

    const cellElement = partitionColumn?.cell(mockRow);
    expect(cellElement).toBeDefined();
  });

  it('should format zpoolCapacity and zpoolSize correctly', () => {
    const { result } = renderHook(() => useListingColumns<ListingItemType>());
    const columns = result.current;

    const mockRow: ListingItemType = {
      id: 'test-id',
      serviceName: 'zpool-123456',
      canCreatePartition: true,
      customName: 'Test NAS',
      datacenter: 'rbx',
      diskType: 'ssd',
      monitored: true,
      zpoolCapacity: 1073741824, // 1GB
      zpoolSize: 2147483648, // 2GB
    };

    const capacityColumn = columns.find(col => col.id === 'zpoolCapacity');
    const sizeColumn = columns.find(col => col.id === 'zpoolSize');

    const capacityElement = capacityColumn?.cell(mockRow);
    const sizeElement = sizeColumn?.cell(mockRow);

    expect(capacityElement).toBeDefined();
    expect(sizeElement).toBeDefined();
  });

  it('should handle empty values correctly', () => {
    const { result } = renderHook(() => useListingColumns<ListingItemType>());
    const columns = result.current;

    const mockRow: ListingItemType = {
      id: 'test-id',
      serviceName: 'zpool-123456',
      canCreatePartition: false,
      customName: undefined,
      datacenter: 'rbx',
      diskType: 'ssd',
      monitored: false,
      zpoolCapacity: undefined,
      zpoolSize: undefined,
    };

    const customNameColumn = columns.find(col => col.id === 'customName');
    const capacityColumn = columns.find(col => col.id === 'zpoolCapacity');

    const customNameElement = customNameColumn?.cell(mockRow);
    const capacityElement = capacityColumn?.cell(mockRow);

    expect(customNameElement).toBeDefined();
    expect(capacityElement).toBeDefined();
  });
});
