import { renderHook } from '@testing-library/react';
import { describe, it } from 'vitest';

import useDatagridColumn from './useDatagridColumn';

describe('useDatagridColumn', () => {
  it('should return correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;

    expect(columns).toHaveLength(5);
    expect(columns[0].id).toBe('name');
    expect(columns[1].id).toBe('address');
    expect(columns[2].id).toBe('email');
    expect(columns[3].id).toBe('status');
  });
});
