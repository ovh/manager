import { Table, TableBody, TableCell, TableRow } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import Price from '@/components/price/Price.component';
import order from '@/types/Order';

const HOUR_IN_MONTH = 730;
const MEGA_BYTES = 1024;
const OrderPricing = ({
  pricings,
}: {
  pricings: {
    offer: order.catalog._public.Plan;
    replication: order.catalog._public.Plan;
  };
}) => {
  const { t } = useTranslation('pci-object-storage/order-funnel');
  const toHourlyTo = (price: number) => price * HOUR_IN_MONTH * MEGA_BYTES;
  const total = {
    price:
      (pricings.offer.pricings?.[0]?.price ?? 0) +
      (pricings.replication?.pricings?.[0]?.price ?? 0),
    tax:
      (pricings.offer.pricings?.[0]?.tax ?? 0) +
      (pricings.replication?.pricings?.[0]?.tax ?? 0),
  };
  return (
    <div data-testid="table-price-container">
      <Table>
        <TableBody>
          <TableRow className="text-xs">
            <TableCell className="px-0 align-top">
              {t('pricing_offer_label')}
            </TableCell>
            <TableCell className="text-right px-0">
              <Price
                className="flex flex-row justify-end items-center flex-wrap gap-2"
                decimals={2}
                priceInUcents={toHourlyTo(pricings.offer.pricings[0].price)}
                taxInUcents={toHourlyTo(pricings.offer.pricings[0].tax)}
              />
            </TableCell>
          </TableRow>
          {pricings.replication && (
            <TableRow className="text-xs">
              <TableCell className="px-0 align-top">
                {t('pricing_option_replication_label')}
              </TableCell>
              <TableCell className="text-right px-0">
                <Price
                  className="flex flex-row justify-end items-center flex-wrap gap-2"
                  decimals={2}
                  priceInUcents={toHourlyTo(
                    pricings.replication.pricings[0].price,
                  )}
                  taxInUcents={toHourlyTo(pricings.replication.pricings[0].tax)}
                />
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell className="font-semibold text-text px-0 align-top">
              {t('total_monthly_label')}
            </TableCell>
            <TableCell className="text-right px-0">
              <Price
                className="flex flex-row justify-end items-center flex-wrap gap-2"
                decimals={2}
                priceInUcents={toHourlyTo(total.price)}
                taxInUcents={toHourlyTo(total.tax)}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderPricing;
