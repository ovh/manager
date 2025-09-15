import { renderHook } from '@testing-library/react';
import { describe, it } from 'vitest';

import useDatagridColumn from '@/hooks/ssl/useDatagridColumn';

describe('useDatagridColumn', () => {
  it('should return correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;

    expect(columns).toHaveLength(7);
    expect(columns[0].id).toBe('mainDomain');
    expect(columns[1].id).toBe('additionalDomain');
    expect(columns[2].id).toBe('type');
    expect(columns[3].id).toBe('state');
    expect(columns[4].id).toBe('creationDate');
    expect(columns[5].id).toBe('expirationDate');
    expect(columns[6].id).toBe('actions');
  });
});
