import { renderHook } from '@testing-library/react';
import { PropsWithChildren, useContext } from 'react';
import {
  PCICommonContext,
  usePCICommonContextFactory,
} from '@/contexts/PCICommonContext/PCICommonContext';

const TestChildrenMerge = ({ children }: PropsWithChildren) => {
  const pciCommonContext = usePCICommonContextFactory({
    myVar: 'children',
  });

  return (
    <PCICommonContext.Provider value={pciCommonContext}>
      {children}
    </PCICommonContext.Provider>
  );
};

const TestChildrenOverride = ({ children }: PropsWithChildren) => (
  <PCICommonContext.Provider
    value={{
      myVar: 'children',
    }}
  >
    {children}
  </PCICommonContext.Provider>
);

describe('usePCICommonContextFactory', () => {
  it('should set value', () => {
    const { result } = renderHook(() => useContext(PCICommonContext), {
      wrapper: ({ children }) => (
        <TestChildrenMerge>{children}</TestChildrenMerge>
      ),
    });

    expect(result.current).toEqual({ myVar: 'children' });
  });

  it('should override previously set value', () => {
    const { result } = renderHook(() => useContext(PCICommonContext), {
      wrapper: ({ children }) => {
        const pciCommonContext = usePCICommonContextFactory({
          myVar: 'parent',
        });

        return (
          <PCICommonContext.Provider value={pciCommonContext}>
            <TestChildrenMerge>{children}</TestChildrenMerge>
          </PCICommonContext.Provider>
        );
      },
    });

    expect(result.current).toEqual({ myVar: 'children' });
  });

  it('should merge with old value', () => {
    const { result } = renderHook(() => useContext(PCICommonContext), {
      wrapper: ({ children }) => {
        const pciCommonContext = usePCICommonContextFactory({
          myVar2: 'parent',
        });

        return (
          <PCICommonContext.Provider value={pciCommonContext}>
            <TestChildrenMerge>{children}</TestChildrenMerge>
          </PCICommonContext.Provider>
        );
      },
    });

    expect(result.current).toEqual({ myVar: 'children', myVar2: 'parent' });
  });

  it('should override old value', () => {
    const { result } = renderHook(() => useContext(PCICommonContext), {
      wrapper: ({ children }) => {
        const pciCommonContext = usePCICommonContextFactory({
          myVar2: 'parent',
        });

        return (
          <PCICommonContext.Provider value={pciCommonContext}>
            <TestChildrenOverride>{children}</TestChildrenOverride>
          </PCICommonContext.Provider>
        );
      },
    });

    expect(result.current).toEqual({ myVar: 'children' });
  });

  it('should work with no values', () => {
    const { result } = renderHook(() => useContext(PCICommonContext), {
      wrapper: ({ children }) => {
        const pciCommonContext = usePCICommonContextFactory();

        return (
          <PCICommonContext.Provider value={pciCommonContext}>
            {children}
          </PCICommonContext.Provider>
        );
      },
    });

    expect(result.current).toEqual({});
  });
});
