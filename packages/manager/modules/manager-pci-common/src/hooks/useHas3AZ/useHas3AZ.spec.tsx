import { renderHook } from '@testing-library/react';
import { useHas3AZ } from './useHas3AZ';
import {
  PCICommonContext,
  usePCICommonContextFactory,
} from '../../contexts/PCICommonContext/PCICommonContext';

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
        wrapper: ({ children }) => {
          const pciCommonContext = usePCICommonContextFactory(meta);

          return (
            <PCICommonContext.Provider value={pciCommonContext}>
              {children}
            </PCICommonContext.Provider>
          );
        },
      });

      expect(result.current).toBe(expected);
    },
  );
});
