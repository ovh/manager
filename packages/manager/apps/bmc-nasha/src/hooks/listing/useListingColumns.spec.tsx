import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ListingItemType } from '@/types/Listing.type';

import { useListingColumns } from './useListingColumns';

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue ?? key,
  }),
}));

describe('useListingColumns', () => {
  type TestRow = ListingItemType;

  it('returns six columns with correct labels', () => {
    const { result } = renderHook(() => useListingColumns<TestRow>());
    expect(result.current).toHaveLength(6);

    const [
      serviceNameCol,
      canCreatePartitionCol,
      customNameCol,
      datacenterCol,
      diskTypeCol,
      monitoredCol,
    ] = result.current;
    expect(serviceNameCol?.label).toBe('listing:serviceName');
    expect(canCreatePartitionCol?.label).toBe('listing:canCreatePartition');
    expect(customNameCol?.label).toBe('listing:customName');
    expect(datacenterCol?.label).toBe('listing:datacenter');
    expect(diskTypeCol?.label).toBe('listing:diskType');
    expect(monitoredCol?.label).toBe('listing:monitored');
  });

  it('renders cells with provided values', () => {
    const { result } = renderHook(() => useListingColumns<TestRow>());
    const [
      serviceNameCol,
      ,
      customNameCol,
      datacenterCol,
      diskTypeCol,
      monitoredCol,
    ] = result.current;

    const row: TestRow = {
      id: '42',
      serviceName: 'nasha-123',
      canCreatePartition: true,
      customName: 'My Nasha',
      datacenter: 'GRA11',
      diskType: 'SSD',
      monitored: true,
    };

    render(serviceNameCol?.cell(row) ?? <div>No cell</div>);
    expect(screen.getByText('nasha-123')).toBeInTheDocument();

    render(customNameCol?.cell(row) ?? <div>No cell</div>);
    expect(screen.getByText('My Nasha')).toBeInTheDocument();

    render(datacenterCol?.cell(row) ?? <div>No cell</div>);
    expect(screen.getByText('GRA11')).toBeInTheDocument();

    render(diskTypeCol?.cell(row) ?? <div>No cell</div>);
    expect(screen.getByText('SSD')).toBeInTheDocument();

    render(monitoredCol?.cell(row) ?? <div>No cell</div>);
    expect(screen.getByText('listing:monitored_true')).toBeInTheDocument();
  });

  it('renders fallback values when fields are missing', () => {
    const { result } = renderHook(() => useListingColumns<TestRow>());
    const [
      serviceNameCol,
      ,
      customNameCol,
      datacenterCol,
      diskTypeCol,
    ] = result.current;

    const row = {} as TestRow; // missing all fields

    render(serviceNameCol?.cell(row) ?? <div>No cell</div>);
    expect(screen.getByText('N/A')).toBeInTheDocument(); // common:na fallback

    render(customNameCol?.cell(row) ?? <div>No cell</div>);
    expect(screen.getByText('—')).toBeInTheDocument(); // common:empty fallback

    render(datacenterCol?.cell(row) ?? <div>No cell</div>);
    expect(screen.getByText('N/A')).toBeInTheDocument(); // common:na fallback

    render(diskTypeCol?.cell(row) ?? <div>No cell</div>);
    expect(screen.getByText('N/A')).toBeInTheDocument(); // common:na fallback
  });
});
