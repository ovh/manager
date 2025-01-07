import { renderHook } from '@testing-library/react';
import { useHas3AZ } from './useHas3AZ';
import { RegionMetaContext } from '../../contexts/RegionMetaContext';

describe('useHas3AZ', () => {
  it.each([
    [false, undefined],
    [false, {}],
    [false, { has3AZ: false }],
    [false, { has3AZ: 'whatever' }],
    [false, { has3AZ: null }],
    [true, { has3AZ: true }],
  ])(
    'should return %s when meta is %o',
    (expected: boolean, meta: { has3AZ: boolean | string } | undefined) => {
      const { result } = renderHook(() => useHas3AZ(), {
        wrapper: ({ children }) => (
          <RegionMetaContext.Provider value={meta}>
            {children}
          </RegionMetaContext.Provider>
        ),
      });

      expect(result.current).toBe(expected);
    },
  );
});
