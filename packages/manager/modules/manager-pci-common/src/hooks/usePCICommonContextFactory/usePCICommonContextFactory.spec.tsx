import { renderHook } from '@testing-library/react';
import { PropsWithChildren, useContext } from 'react';
import { PCICommonContext } from '@/contexts/PCICommonContext/PCICommonContext';
import { usePCICommonContextFactory } from './usePCICommonContextFactory';

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

const ParentWithoutProvider = ({ children }: PropsWithChildren) => (
  <TestChildrenMerge>{children}</TestChildrenMerge>
);

const ParentWithMyVar = ({ children }: PropsWithChildren) => {
  const pciCommonContext = usePCICommonContextFactory({
    myVar: 'parent',
  });

  return (
    <PCICommonContext.Provider value={pciCommonContext}>
      <TestChildrenMerge>{children}</TestChildrenMerge>
    </PCICommonContext.Provider>
  );
};

const ParentWithMyVar2 = ({ children }: PropsWithChildren) => {
  const pciCommonContext = usePCICommonContextFactory({
    myVar2: 'parent',
  });

  return (
    <PCICommonContext.Provider value={pciCommonContext}>
      <TestChildrenMerge>{children}</TestChildrenMerge>
    </PCICommonContext.Provider>
  );
};

const ParentWithEmptyFactory = ({ children }: PropsWithChildren) => {
  const pciCommonContext = usePCICommonContextFactory();

  return (
    <PCICommonContext.Provider value={pciCommonContext}>
      {children}
    </PCICommonContext.Provider>
  );
};

describe('usePCICommonContextFactory', () => {
  it('should set value', () => {
    const { result } = renderHook(() => useContext(PCICommonContext), {
      wrapper: ParentWithoutProvider,
    });

    expect(result.current).toEqual({ myVar: 'children' });
  });

  it('should override previously set value', () => {
    const { result } = renderHook(() => useContext(PCICommonContext), {
      wrapper: ParentWithMyVar,
    });

    expect(result.current).toEqual({ myVar: 'children' });
  });

  it('should merge with old value', () => {
    const { result } = renderHook(() => useContext(PCICommonContext), {
      wrapper: ParentWithMyVar2,
    });

    expect(result.current).toEqual({ myVar: 'children', myVar2: 'parent' });
  });

  it('should override old value', () => {
    const { result } = renderHook(() => useContext(PCICommonContext), {
      wrapper: ({ children }) => (
        <ParentWithMyVar2>
          <TestChildrenOverride>{children}</TestChildrenOverride>
        </ParentWithMyVar2>
      ),
    });

    expect(result.current).toEqual({ myVar: 'children' });
  });

  it('should work with no values', () => {
    const { result } = renderHook(() => useContext(PCICommonContext), {
      wrapper: ParentWithEmptyFactory,
    });

    expect(result.current).toEqual({});
  });
});
