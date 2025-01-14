import { renderHook } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { PCICommonContext } from '@/contexts/PCICommonContext/PCICommonContext';
import { usePCICommonContextFactory } from './usePCICommonContextFactory';

const PropAContext = ({ children }: PropsWithChildren) => {
  const pciCommonContext = usePCICommonContextFactory({
    propA: 'parent',
  });

  return (
    <PCICommonContext.Provider value={pciCommonContext}>
      {children}
    </PCICommonContext.Provider>
  );
};

describe('usePCICommonContextFactory', () => {
  it('should display old value if no provided', () => {
    const { result } = renderHook(() => usePCICommonContextFactory(), {
      wrapper: PropAContext,
    });

    expect(result.current).toEqual({ propA: 'parent' });
  });

  it('should set value', () => {
    const { result } = renderHook(() =>
      usePCICommonContextFactory({ propA: 'prop' }),
    );

    expect(result.current).toEqual({ propA: 'prop' });
  });

  it('should override previously set value', () => {
    const { result } = renderHook(
      () => usePCICommonContextFactory({ propA: 'children' }),
      {
        wrapper: PropAContext,
      },
    );

    expect(result.current).toEqual({ propA: 'children' });
  });

  it('should merge with old value', () => {
    const { result } = renderHook(
      () => usePCICommonContextFactory({ propB: 'children' }),
      {
        wrapper: PropAContext,
      },
    );

    expect(result.current).toEqual({ propA: 'parent', propB: 'children' });
  });

  it('should work with no values', () => {
    const { result } = renderHook(() => usePCICommonContextFactory());

    expect(result.current).toEqual({});
  });
});
