import { renderHook } from '@testing-library/react';
import { describe } from 'vitest';
import { wrapper } from '@/wrapperRenders';
import { useExecutionDatagridColumns } from './useExecutionDatagridColumns';

describe('useExecutionDatagridColumns tests', () => {
  it('Should render items with 3 columns', () => {
    const { result } = renderHook(() => useExecutionDatagridColumns(), {
      wrapper,
    });

    const items = result.current;

    expect(items.length).toBe(3);
    expect(items[0].id).toBe('executedAtDate');
    expect(items[1].id).toBe('executedAtTime');
    expect(items[2].id).toBe('state');
  });
});
