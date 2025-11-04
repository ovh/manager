import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@ovh-ux/muk';
import { Node } from '@/types/node';
import { NodeSubmenuItem } from '../../node-menu/NodeSubmenuItem/NodeSubmenuItem.component';
import { shouldHideElement } from '../../../sidebar/utils';

interface SidebarAccordionItemProps {
  node: Node;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SidebarAccordionItem: React.FC<SidebarAccordionItemProps> = ({
  node,
  onClick,
}) => {
  const { t } = useTranslation('sidebar');

  const visibleChildren = useMemo(
    () =>
      node?.children
        ?.filter((childNode: Node) => !shouldHideElement(childNode, true))
        .map((childNode: Node) => (
          <NodeSubmenuItem key={childNode.id} node={childNode} />
        )),
    [node?.children],
  );

  return (
    <AccordionItem value={node.id} className="px-2">
      <AccordionTrigger
        className="px-2 py-3 border-b border-solid font-semibold border-b-gray-300 border-t-0 border-l-0 border-r-0"
        id={node.id}
        onClick={onClick}
      >
        {t(node.translation)}
      </AccordionTrigger>
      <AccordionContent className="p-0">{visibleChildren}</AccordionContent>
    </AccordionItem>
  );
};
