import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, Icon } from '@ovh-ux/muk';
import { Node } from '../../sidebar/navigation-tree/node';
import { SidebarAccordionItem } from '../SidebarAccordionItem/SidebarAccordionItem.component';

interface SubMenuProps {
  node: Node;
  open: boolean;
  close: () => void;
}

export const SubMenu = ({ node, open, close }: SubMenuProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const { t } = useTranslation('sidebar');

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  if (!isOpen) return <></>;
  return (
    <div className="absolute inset-0 bg-white">
      <div
        aria-label={t('sidebar_back_menu')}
        className="p-0 border-b border-solid border-b-gray-300 border-t-0 border-l-0 border-r-0 px-2 py-3 text-[var(--ods-color-primary-800)] w-full cursor-pointer"
        onClick={() => close()}
        tabIndex={0}
      >
        <>
          <Icon
            name="arrow-left"
            className="fill-[var(--ods-color-primary-800)] mr-1"
          />
          {t('sidebar_back_menu')}
        </>
      </div>
      <div className="pl-2 pt-2 pb-1 text-xs">{t(node.translation)}</div>
      <Accordion>
        {node.children.map((childNode: Node) => (
          <SidebarAccordionItem node={childNode} />
        ))}
      </Accordion>
    </div>
  );
};
