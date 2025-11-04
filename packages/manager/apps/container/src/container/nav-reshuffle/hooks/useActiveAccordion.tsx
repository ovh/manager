import { useEffect, useState } from 'react';
import { Node } from '@/types/node';
import useProductNavReshuffle from '@/core/product-nav-reshuffle/useProductNavReshuffle';

export const useActiveAccordion = (node: Node) => {
  const { currentNavigationNode } = useProductNavReshuffle();
  const [openedAccordion, setOpenedAccordion] = useState<Node>(null);

  useEffect(() => {
    const foundNode: Node = node.children?.find(
      (childNode: Node): Node => {
        return childNode.children?.find(
          (childestNode: Node) => childestNode.id === currentNavigationNode?.id,
        );
      },
    );
    if (foundNode) setOpenedAccordion(foundNode);
  }, [currentNavigationNode]);
  return openedAccordion;
};
