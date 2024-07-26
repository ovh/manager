import { renderHook } from '@testing-library/react';
import { describe, it } from 'vitest';
import { useDatagridColumn } from './UseDatagridColumn';

describe('useDatagridColumn', () => {
  it('returns correct column definitions', () => {
    const { result } = renderHook(() => useDatagridColumn());

    expect(result.current).toHaveLength(7);
    expect(result.current[0].id).toBe('description');
    expect(result.current[1].id).toBe('products');
    expect(result.current[2].id).toBe('voucher');
    expect(result.current[3].id).toBe('validityFrom');
    expect(result.current[4].id).toBe('total_credit');
    expect(result.current[5].id).toBe('validityTo');
    expect(result.current[6].id).toBe('available_credit');
  });

  it('returns correct labels for columns', () => {
    const { result } = renderHook(() => useDatagridColumn());

    expect(result.current[0].label).toBe('cpb_vouchers_name_cell');
    expect(result.current[1].label).toBe('cpb_vouchers_products_cell');
    expect(result.current[2].label).toBe('cpb_vouchers_voucher_cell');
    expect(result.current[3].label).toBe('cpb_vouchers_validity_from_cell');
    expect(result.current[4].label).toBe('cpb_vouchers_total_credit_cell');
    expect(result.current[5].label).toBe('cpb_vouchers_validity_to_cell');
    expect(result.current[6].label).toBe('cpb_vouchers_available_credit_cell');
  });
});
