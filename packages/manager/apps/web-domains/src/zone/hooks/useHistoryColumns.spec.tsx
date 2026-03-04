import '@/common/setupTests';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, render, fireEvent } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { wrapper } from '@/common/utils/test.provider';
import { useHistoryColumns } from '@/zone/hooks/useHistoryColumns';
import type { TZoneHistoryWithDate } from '@/zone/types/history.types';

const mockItem: TZoneHistoryWithDate = {
  id: 'history-1',
  date: '2024-01-15T10:00:00Z',
  creationDate: '2024-01-15T10:00:00Z',
  zoneFileUrl: 'https://api.example.com/zone/file/1',
};

vi.mock('@/zone/hooks/data/history.hooks', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@/zone/hooks/data/history.hooks')
  >();
  return {
    ...actual,
    useDownloadZoneFile: vi.fn(() => ({
      mutate: vi.fn(),
      isPending: false,
    })),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return {
    ...actual,
    useFormatDate: vi.fn(() => ({ date }: { date: string }) => date),
  };
});

describe('useHistoryColumns', () => {
  const { t } = useTranslation('zone');

  it('returns 4 columns', () => {
    const { result } = renderHook(() =>
      useHistoryColumns({
        t,
        onView: vi.fn(),
        onRestore: vi.fn(),
        zoneName: 'example.com',
      }),
    );
    expect(result.current).toHaveLength(4);
  });

  it('includes creationDate column', () => {
    const { result } = renderHook(() =>
      useHistoryColumns({
        t,
        onView: vi.fn(),
        onRestore: vi.fn(),
        zoneName: 'example.com',
      }),
    );
    const ids = result.current.map((col) => col.id);
    expect(ids).toContain('creationDate');
  });

  it('includes view column', () => {
    const { result } = renderHook(() =>
      useHistoryColumns({
        t,
        onView: vi.fn(),
        onRestore: vi.fn(),
        zoneName: 'example.com',
      }),
    );
    const ids = result.current.map((col) => col.id);
    expect(ids).toContain('view');
  });

  it('includes download column', () => {
    const { result } = renderHook(() =>
      useHistoryColumns({
        t,
        onView: vi.fn(),
        onRestore: vi.fn(),
        zoneName: 'example.com',
      }),
    );
    const ids = result.current.map((col) => col.id);
    expect(ids).toContain('download');
  });

  it('includes restore column', () => {
    const { result } = renderHook(() =>
      useHistoryColumns({
        t,
        onView: vi.fn(),
        onRestore: vi.fn(),
        zoneName: 'example.com',
      }),
    );
    const ids = result.current.map((col) => col.id);
    expect(ids).toContain('restore');
  });

  it('creationDate column is sortable', () => {
    const { result } = renderHook(() =>
      useHistoryColumns({
        t,
        onView: vi.fn(),
        onRestore: vi.fn(),
        zoneName: 'example.com',
      }),
    );
    const creationDateCol = result.current.find(
      (col) => col.id === 'creationDate',
    );
    expect(creationDateCol?.isSortable).toBe(true);
  });

  it('view column is not sortable', () => {
    const { result } = renderHook(() =>
      useHistoryColumns({
        t,
        onView: vi.fn(),
        onRestore: vi.fn(),
        zoneName: 'example.com',
      }),
    );
    const viewCol = result.current.find((col) => col.id === 'view');
    expect(viewCol?.isSortable).toBe(false);
  });

  it('passes item to onView when view cell is clicked', () => {
    const onView = vi.fn();
    const { result } = renderHook(() =>
      useHistoryColumns({
        t,
        onView,
        onRestore: vi.fn(),
        zoneName: 'example.com',
      }),
    );
    const viewCol = result.current.find((col) => col.id === 'view');
    // Render the cell and click
    const CellComponent = () => viewCol?.cell(mockItem);
    const { getByRole } = render(<CellComponent />, { wrapper });
    fireEvent.click(getByRole('button'));
    expect(onView).toHaveBeenCalledWith(mockItem);
  });
});
