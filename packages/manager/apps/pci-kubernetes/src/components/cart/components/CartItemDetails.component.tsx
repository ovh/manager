import { AccordionContent, Divider, Text } from '@ovhcloud/ods-react';

import { useCatalogPrice } from '@ovh-ux/muk';

import { TCartItemDetail } from '../Cart.model';

type TCartItemsDetailsProps = {
  details: TCartItemDetail[];
};

export const CartItemDetails = ({ details }: TCartItemsDetailsProps) => {
  const { getTextPrice } = useCatalogPrice(4);

  return (
    <AccordionContent className="bg-[--ods-color-neutral-050] px-8 py-5">
      {details.map(({ name, description, price, priceUnit, isApproximate }, index) => (
        <div key={`${name}-${index}`} data-testid={`cart-item-details-${name}`}>
          <Text className="text-sm text-[--ods-color-heading]">{name}</Text>
          <div className="flex justify-between">
            {description}
            {price != null && (
              <Text preset="heading-6" className="text-right" data-testid="cart-item-details-price">
                {isApproximate && '~'}
                {getTextPrice(price)} {priceUnit}
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
};
