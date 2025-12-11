import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion } from '@ovh-ux/muk';
import { Node } from '@/types/node';
import { SubMenu } from '../../common/Submenu/Submenu.component';
import { SidebarAccordionItem } from '../../sidebar/SidebarAccordionItem/SidebarAccordionItem.component';
import { NodeSubmenuItem } from '../NodeSubmenuItem/NodeSubmenuItem.component';
import { useActiveAccordion } from '../../../hooks/useActiveAccordion';
import { PciSection } from '../../pci-section/PciSection/PciSection.component';
import { shouldHideElement } from '../../../sidebar/utils';

interface NodeSubmenuProps {
  node: Node;
  close: () => void;
}

export const NodeSubmenu = ({ node, close }: NodeSubmenuProps) => {
  const { t } = useTranslation('sidebar');
  const openedAccordion = useActiveAccordion(node);
  const [accordionValue, setAccordionValue] = useState<string | null>(
    openedAccordion?.id || null
  );

  useEffect(() => {
    if (openedAccordion?.id) {
      setAccordionValue(openedAccordion.id);
    }
  }, [openedAccordion]);

  const handleAccordionClick = (event: React.MouseEvent) => {
    const clickedId = (event.target as HTMLElement).closest('button')?.id;
    if (!clickedId) return;

    setAccordionValue((previous: string | null) =>
      previous === clickedId ? null : clickedId,
    );
  };

  const { accordionItems } = useMemo(() => {
    const filtered = node.children.filter(
      (childNode: Node) => !shouldHideElement(childNode, true),
    );

    const accordionItems = filtered.map((childNode: Node) =>
      childNode.children && childNode.children.length > 0 ? (
        <SidebarAccordionItem
          key={childNode.id}
          node={childNode}
          onClick={handleAccordionClick}
        />
      ) : (
        <div className="px-2">
          <NodeSubmenuItem key={childNode.id} node={childNode} />
        </div>
      ),
    );

    return { accordionItems };
  }, [node.children]);

  return (
    <SubMenu title={t(node.translation)} close={close}>
      {node?.id.startsWith('pci') && <PciSection />}
      {accordionItems.length > 0 && (
        <Accordion value={[accordionValue]} multiple={false}>
          {accordionItems}
        </Accordion>
      )}
    </SubMenu>
  );
};
