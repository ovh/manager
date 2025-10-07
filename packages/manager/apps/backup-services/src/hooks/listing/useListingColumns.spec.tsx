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

  it('returns two columns with correct labels', () => {
    const { result } = renderHook(() => useListingColumns<TestRow>());
    expect(result.current).toHaveLength(2);

    const [idCol, nameCol] = result.current;
    expect(idCol.label).toBe('common:id');
    expect(nameCol.label).toBe('common:name');
  });

  it('renders cells with provided values', () => {
    const { result } = renderHook(() => useListingColumns<TestRow>());
    const [idCol, nameCol] = result.current;

    const row: TestRow = { id: '42', name: 'Alice' };

    render(idCol.cell(row));
    expect(screen.getByText('42')).toBeInTheDocument();

    render(nameCol.cell(row));
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders fallback values when fields are missing', () => {
    const { result } = renderHook(() => useListingColumns<TestRow>());
    const [idCol, nameCol] = result.current;

    const row = {} as TestRow; // missing both id and name

    render(idCol.cell(row));
    expect(screen.getByText('N/A')).toBeInTheDocument(); // common:na fallback

    render(nameCol.cell(row));
    expect(screen.getByText('—')).toBeInTheDocument(); // common:empty fallback
  });
});
