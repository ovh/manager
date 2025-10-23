import { AccordionContent, Divider, Text } from '@ovhcloud/ods-react';
import { TCartItemDetail } from '../Cart.component';

type TCartItemsDetailsProps = {
  details: TCartItemDetail[];
};

export const CartItemDetails = ({ details }: TCartItemsDetailsProps) => (
  <AccordionContent className="bg-[--ods-color-neutral-050] py-5 px-8">
    {details.map(({ name, description, price }, index) => (
      <div key={`${name}-${index}`} data-testid={`cart-item-details-${name}`}>
        <Text className="text-sm text-[--ods-color-heading]">{name}</Text>

        <div className="flex justify-between">
          {description}
          {price && (
            <Text preset="heading-6" data-testid="cart-item-details-price">
              {price}
            </Text>
          )}
        </div>

        {index !== details.length - 1 && (
          <Divider spacing="6" data-testid="cart-item-details-divider" />
        )}
      </div>
    ))}
  </AccordionContent>
);
