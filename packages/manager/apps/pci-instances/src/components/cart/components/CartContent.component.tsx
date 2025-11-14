import { Accordion, AccordionChangeDetail } from '@ovhcloud/ods-react';
import { ReactNode, useState } from 'react';
import { TCartItem } from '../Cart.component';

export type TRenderCartItemParams = {
  item: TCartItem;
  isExpanded: (accordionName: string) => boolean;
};

export type TCartContentProps = {
  items: TCartItem[];
  renderCartItem: (params: TRenderCartItemParams) => ReactNode;
};

export const CartContent = ({ items, renderCartItem }: TCartContentProps) => {
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>(
    items.filter((item) => item.expanded).map((item) => item.id),
  );

  const handleAccordionChange = (accordion: AccordionChangeDetail) =>
    setExpandedAccordions(accordion.value);

  const isExpanded = (accordionId: string) =>
    expandedAccordions.includes(accordionId);

  return (
    <Accordion
      value={expandedAccordions}
      onChange={handleAccordionChange}
      data-testid="cart-content"
    >
      {items.map((item) => renderCartItem({ item, isExpanded }))}
    </Accordion>
  );
};
