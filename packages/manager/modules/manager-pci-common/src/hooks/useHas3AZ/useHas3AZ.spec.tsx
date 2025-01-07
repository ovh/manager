import { renderHook } from '@testing-library/react';
import { useHas3AZ } from './useHas3AZ';
import { MetaContext } from '../../contexts/MetaContext';

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
          <MetaContext.Provider value={meta}>{children}</MetaContext.Provider>
        ),
      });

      expect(result.current).toBe(expected);
    },
  );
});
