import { Accordion, AccordionChangeDetail } from '@ovhcloud/ods-react';
import { ReactNode, useCallback, useState } from 'react';
import { TCartItem } from '../Cart.component';

type TRenderItemParams = {
  item: TCartItem;
  isExpanded: (accordionName: string) => boolean;
};

type TCartContentProps = {
  items: TCartItem[];
  renderCartItem: (params: TRenderItemParams) => ReactNode;
};

export const CartContent = ({ items, renderCartItem }: TCartContentProps) => {
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>(
    items.filter((item) => item.expanded).map((item) => item.title),
  );

  const handleAccordionChange = useCallback(
    (accordion: AccordionChangeDetail) =>
      setExpandedAccordions(accordion.value),
    [setExpandedAccordions],
  );

  const isExpanded = useCallback(
    (accordionName: string) => expandedAccordions.includes(accordionName),
    [expandedAccordions],
  );
  return (
    <Accordion value={expandedAccordions} onChange={handleAccordionChange}>
      {items.map((item) => renderCartItem({ item, isExpanded }))}
    </Accordion>
  );
};
