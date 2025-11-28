import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, Icon } from '@ovh-ux/muk';
import { Node } from '../../data/config/navigation/types/node';
import { SidebarAccordionItem } from '../SidebarAccordionItem/SidebarAccordionItem.component';
import { useActiveAccordion } from '../../hooks/useActiveAccordion';
import { PciSection } from '../PciSection/PciSection.component';
import { shouldHideElement } from '../../sidebar/utils';

interface SubMenuProps {
  node: Node;
  open: boolean;
  close: () => void;
}

export const SubMenu = ({ node, open, close }: SubMenuProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const { t } = useTranslation('sidebar');
  const buttonRef = useRef(null);
  const [accordionValue, setAccordionValue] = useState<string>(null);
  const openedAccordion = useActiveAccordion(node);

  useEffect(() => {
    if (openedAccordion) {
      setAccordionValue(openedAccordion.id);
      setIsOpen(true);
    }
  }, [openedAccordion]);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (!isOpen) return;
    buttonRef.current?.focus();
  }, [isOpen]);

  const visibleChildren = useMemo(
    () =>
      node.children
        .filter((childNode: Node) => !shouldHideElement(childNode, true))
        .map((childNode: Node) => (
          <SidebarAccordionItem
            key={childNode.id}
            node={childNode}
            onClick={(event) =>
              setAccordionValue(
                (event.target as HTMLElement).closest('button')?.id,
              )
            }
          />
        )),
    [node.children],
  );

  if (!isOpen) return <></>;
  return (
    <div className="absolute inset-0 bg-white z-10 flex flex-col h-full">
      <div
        aria-label={t('sidebar_back_menu')}
        className="p-0 border-b border-solid border-b-gray-300 border-t-0 border-l-0 border-r-0 px-2 py-3 text-[var(--ods-color-primary-800)] w-full cursor-pointer"
        onClick={() => close()}
        onKeyUp={(e) => {
          if (e.key === 'Enter') close();
        }}
        tabIndex={0}
        role="button"
        ref={buttonRef}
      >
        <>
          <Icon
            name="arrow-left"
            className="fill-[var(--ods-color-primary-800)] mr-1"
          />
          {t('sidebar_back_menu')}
        </>
      </div>
      <div className="overflow-y-auto">
        <div className="pl-2 pt-2 pb-1 text-xs">{t(node.translation)}</div>
        {node?.id.startsWith('pci') && <PciSection />}
        <Accordion value={[accordionValue]} multiple={false}>
          {visibleChildren}
        </Accordion>
      </div>
    </div>
  );
};
