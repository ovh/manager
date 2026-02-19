import { useCatalogPrice } from '@ovh-ux/muk';
import { Text, Divider } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { BILLING_TYPE } from '@/types/instance/common.type';

type TCartTotalPriceProps = {
  hourlyTotal: number | null;
  monthlyTotal: number | null;
  billingType: BILLING_TYPE;
};

export const CartTotalPrice = ({
  hourlyTotal,
  monthlyTotal,
}: TCartTotalPriceProps) => {
  const { getTextPrice } = useCatalogPrice(4);
  const { t } = useTranslation(['creation']);

  return (
    <div data-testid="cart-total-price" className="pt-7">
      {hourlyTotal !== null && (
        <>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <Text preset="heading-5">
                {t('creation:pci_instance_creation_cart_total_label')}
              </Text>
              <Text
                data-testid="cart-hourly-total-price"
                className="text-[--ods-color-neutral-600]"
              >
                {t('creation:pci_instance_creation_cart_hourly_price_label')}
              </Text>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Text preset="heading-3" className="block">
                {getTextPrice(hourlyTotal)}
              </Text>
              <Text className="block text-[--ods-color-neutral-600]">
                {t(
                  'creation:pci_instance_creation_table_header_price_hourly_unit',
                )}
              </Text>
            </div>
          </div>

          {monthlyTotal !== null && <Divider spacing="6" />}

          {monthlyTotal !== null && (
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <Text
                  data-testid="cart-monthly-total-price"
                  className="text-[--ods-color-neutral-600]"
                >
                  {t('creation:pci_instance_creation_cart_monthly_price_label')}
                </Text>
                <Text className="text-[--ods-color-neutral-600]">
                  {t(
                    'creation:pci_instance_creation_cart_monthly_price_disclaimer',
                  )}
                </Text>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Text
                  preset="heading-5"
                  className="block text-[--ods-color-neutral-600]"
                >
                  {getTextPrice(monthlyTotal)}
                </Text>
                <Text className="block text-[--ods-color-neutral-600]">
                  {t(
                    'creation:pci_instance_creation_table_header_price_monthly_unit',
                  )}
                </Text>
              </div>
            </div>
          )}
        </>
      )}

      {hourlyTotal === null && monthlyTotal !== null && (
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <Text preset="heading-5">
              {t('creation:pci_instance_creation_cart_total_label')}
            </Text>
            <Text
              data-testid="cart-monthly-total-price"
              className="text-[--ods-color-neutral-600]"
            >
              {t('creation:pci_instance_creation_cart_monthly_price_label')}
            </Text>
            <Text className="text-[--ods-color-neutral-600]">
              {t(
                'creation:pci_instance_creation_cart_monthly_price_disclaimer',
              )}
            </Text>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Text preset="heading-3" className="block">
              {getTextPrice(monthlyTotal)}
            </Text>
            <Text className="block text-[--ods-color-neutral-600]">
              {t(
                'creation:pci_instance_creation_table_header_price_monthly_unit',
              )}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};
