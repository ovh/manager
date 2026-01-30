import { TCartItemDetail } from '@/pages/instances/create/hooks/useCartItems';
import { AccordionContent, Divider, Text } from '@ovhcloud/ods-react';
import { useCatalogPrice } from '@ovh-ux/muk';

type TCartItemsDetailsProps = {
  details: TCartItemDetail[];
};

export const CartItemDetails = ({ details }: TCartItemsDetailsProps) => {
  const { getTextPrice } = useCatalogPrice(4);

  return (
    <AccordionContent className="bg-[--ods-color-neutral-050] px-8 py-5">
      {details.map(
        ({ name, description, price, displayPrice, priceUnit }, index) => (
          <div
            key={`${name}-${index}`}
            data-testid={`cart-item-details-${name}`}
          >
            <Text className="text-sm text-[--ods-color-heading]">{name}</Text>

            <div className="flex justify-between">
              {description}
              {displayPrice && price !== undefined && (
                <div className="flex flex-col items-end">
                  <Text
                    preset="heading-6"
                    className="text-[--ods-color-heading]"
                    data-testid="cart-item-details-price"
                  >
                    {getTextPrice(price)}
                  </Text>
                  {priceUnit && <Text>{priceUnit}</Text>}
                </div>
              )}
            </div>

            {index !== details.length - 1 && (
              <Divider spacing="6" data-testid="cart-item-details-divider" />
            )}
          </div>
        ),
      )}
    </AccordionContent>
  );
};
