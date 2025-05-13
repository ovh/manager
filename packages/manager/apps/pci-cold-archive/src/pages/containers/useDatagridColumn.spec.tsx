import { renderHook } from '@testing-library/react';
import { useDatagridColumn } from './useDatagridColumn';

describe('useDatagridColumn tests', () => {
  it('the length of column should be 5', () => {
    const { result } = renderHook(() => useDatagridColumn());

    expect(result.current.length).toEqual(7);
  });

  it('Should match snapshot', () => {
    const { result } = renderHook(() => useDatagridColumn());

    expect(result.current).toMatchSnapshot();
  });
});
