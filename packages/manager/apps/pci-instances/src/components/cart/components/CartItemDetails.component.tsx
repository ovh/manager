import { QuantitySelector } from '@/pages/instances/create/components/QuantitySelector.component';
import { TCartItemDetail } from '@/pages/instances/create/hooks/useCartItems';
import { AccordionContent, Divider, Text } from '@ovhcloud/ods-react';
import { TQuantityHintParams } from '@/pages/instances/create/view-models/cartViewModel';
import { useTranslation } from 'react-i18next';
import { useCatalogPrice } from '@ovh-ux/muk';

type TCartItemsDetailsProps = {
  details: TCartItemDetail[];
  quantityHintParams?: TQuantityHintParams;
};

export const CartItemDetails = ({
  details,
  quantityHintParams,
}: TCartItemsDetailsProps) => {
  const quota = quantityHintParams?.quota ?? 1;
  const type = quantityHintParams?.type ?? '';
  const region = quantityHintParams?.region ?? '';
  const { t } = useTranslation(['creation', 'regions']);
  const translatedRegion = t(
    `regions:manager_components_region_${region}_micro`,
    {
      micro: quantityHintParams?.regionId,
    },
  );
  const { getTextPrice } = useCatalogPrice(4);

  return (
    <AccordionContent className="min-h-0 flex-1 overflow-y-auto bg-[--ods-color-neutral-050] px-8 py-5">
      <QuantitySelector quota={quota} type={type} region={translatedRegion} />
      <Divider spacing="16" />
      {details.map(
        ({ name, description, price, priceUnit, isApproximate }, index) => (
          <div
            key={`${name}-${index}`}
            data-testid={`cart-item-details-${name}`}
          >
            <Text className="text-sm text-[--ods-color-heading]">{name}</Text>
            <div className="flex justify-between">
              {description}
              {price != null && (
                <div
                  className="flex flex-col items-end gap-1"
                  data-testid="cart-item-details-price"
                >
                  <Text preset="heading-6" className="block">
                    {isApproximate && '~'}
                    {getTextPrice(price)}
                  </Text>
                  <Text className="block text-[--ods-color-neutral-600]">
                    {priceUnit}
                  </Text>
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
