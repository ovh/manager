import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableRow } from '@datatr-ux/uxlib';
import Price from '@/components/price/Price.component';
import { ServicePricing } from '@/lib/pricingHelper';

interface TablePriceProps {
  prices: ServicePricing;
}
const OfferPricing = ({ prices }: TablePriceProps) => {
  const { t } = useTranslation('pricing');

  return (
    <div data-testid="table-price-container">
      <Table>
        <TableBody>
          <TableRow className="text-xs p-0">
            <TableCell className="px-0 align-top py-0 bg-red-500">
              {t('pricing_instance_label')}
            </TableCell>
            <TableCell className="text-right px-0 py-0">
              <Price
                className="flex flex-row justify-end items-center flex-wrap gap-2"
                decimals={3}
                priceInUcents={prices.flavorPrice.hourly.price}
                taxInUcents={prices.flavorPrice.hourly.tax}
              />
            </TableCell>
          </TableRow>
          <TableRow className="text-xs py-0">
            <TableCell className="px-0 align-top py-0 bg-red-200">
              {t('pricing_storage_label')}
            </TableCell>
            <TableCell className="text-right px-0 py-0">
              <Price
                className="flex flex-row justify-end items-center flex-wrap gap-2"
                decimals={3}
                priceInUcents={prices.storagePrice.hourly.price}
                taxInUcents={prices.storagePrice.hourly.tax}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold text-text px-0 align-top min-w-[110px] py-0">
              {t('total_hour_label')}
            </TableCell>
            <TableCell className="text-right px-0 py-0">
              <Price
                className="flex flex-row justify-end items-center flex-wrap gap-2"
                decimals={3}
                priceInUcents={prices.servicePrice.hourly.price}
                taxInUcents={prices.servicePrice.hourly.tax}
              />
            </TableCell>
          </TableRow>
          <TableRow className="text-sm text-gray-500 italic ">
            <TableCell className="px-0 align-top py-0">
              {t('estimated_month_label')}
            </TableCell>
            <TableCell className="text-right px-0 py-0">
              <Price
                className="flex flex-row justify-end items-center flex-wrap gap-2"
                decimals={0}
                priceInUcents={prices.servicePrice.monthly.price}
                taxInUcents={prices.servicePrice.monthly.tax}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default OfferPricing;
