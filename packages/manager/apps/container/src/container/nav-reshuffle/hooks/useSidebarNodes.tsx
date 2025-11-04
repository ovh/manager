import { useMemo } from 'react';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { Node } from '@/types/node';

export const useSidebarNodes = (): Node[] => {
  const { navigationTree } = useProductNavReshuffle();

  const nodes = useMemo(() => {
    if (!navigationTree?.children) return [];
    return navigationTree.children
      .find((child) => child.id === 'sidebar')
      .children.map((node: Node) => {
        return node;
      });
  }, [navigationTree]);

  return nodes;
};
