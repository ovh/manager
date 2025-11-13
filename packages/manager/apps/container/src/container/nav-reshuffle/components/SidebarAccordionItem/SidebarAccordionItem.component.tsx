import { useTranslation } from 'react-i18next';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@ovh-ux/muk';
import { Node } from '../../sidebar/navigation-tree/node';
import { SubmenuItem } from '../SubmenuItem/SubmenuItem.component';

interface SidebarAccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  node: Node;
}

export const SidebarAccordionItem: React.FC<SidebarAccordionItemProps> = ({
  node,
}) => {
  const { t } = useTranslation('sidebar');

  return (
    <AccordionItem value={node.id} className="px-2">
      <AccordionTrigger className="px-2 py-3 border-b border-solid font-semibold border-b-gray-300 border-t-0 border-l-0 border-r-0">
        {t(node.translation)}
      </AccordionTrigger>
      <AccordionContent className="p-0">
        {node?.children?.map((childNode: Node) => (
          <SubmenuItem key={childNode.id} node={childNode} onClick={() => {}} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};
