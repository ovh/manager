import { renderHook } from '@testing-library/react';
import { PropsWithChildren, useContext } from 'react';
import { PCICommonContext } from '@/contexts/PCICommonContext/PCICommonContext';
import { usePCICommonContextFactory } from './usePCICommonContextFactory';

const myVarChildren = {
  myVar: 'children',
};

const TestChildrenMerge = ({ children }: PropsWithChildren) => {
  const pciCommonContext = usePCICommonContextFactory(myVarChildren);

  return (
    <PCICommonContext.Provider value={pciCommonContext}>
      {children}
    </PCICommonContext.Provider>
  );
};

const TestChildrenOverride = ({ children }: PropsWithChildren) => (
  <PCICommonContext.Provider value={myVarChildren}>
    {children}
  </PCICommonContext.Provider>
);

const ParentWithoutProvider = ({ children }: PropsWithChildren) => (
  <TestChildrenMerge>{children}</TestChildrenMerge>
);

const myVarParent = {
  myVar: 'parent',
};

const ParentWithMyVar = ({ children }: PropsWithChildren) => {
  const pciCommonContext = usePCICommonContextFactory(myVarParent);

  return (
    <PCICommonContext.Provider value={pciCommonContext}>
      <TestChildrenMerge>{children}</TestChildrenMerge>
    </PCICommonContext.Provider>
  );
};

const myVar2Parent = {
  myVar2: 'parent',
};

const ParentWithMyVar2 = ({ children }: PropsWithChildren) => {
  const pciCommonContext = usePCICommonContextFactory(myVar2Parent);

  return (
    <PCICommonContext.Provider value={pciCommonContext}>
      {children}
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
      wrapper: ({ children }) => (
        <ParentWithMyVar2>
          <TestChildrenMerge>{children}</TestChildrenMerge>
        </ParentWithMyVar2>
      ),
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
