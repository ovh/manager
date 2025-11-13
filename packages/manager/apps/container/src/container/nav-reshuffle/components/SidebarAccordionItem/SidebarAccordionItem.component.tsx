import { useTranslation } from 'react-i18next';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@ovh-ux/muk';
import { Node } from '../../sidebar/navigation-tree/node';
import { MenuItem } from '../MenuItem/MenuItem.component';

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
      <AccordionTrigger className="px-2 py-3 border-b border-solid border-b-gray-300 border-t-0 border-l-0 border-r-0">
        {t(node.translation)}
      </AccordionTrigger>
      <AccordionContent>
        {node?.children?.map((childNode: Node) => (
          <MenuItem node={childNode} onClick={() => {}} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};
