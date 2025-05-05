import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableRow } from '@datatr-ux/uxlib';
import Price from '@/components/price/Price.component';
import { Pricing, ServicePricing } from '@/lib/pricingHelper';

interface OrderPriceProps {
  showMonthly: boolean;
  prices: ServicePricing;
}
const OrderPrice2 = ({ showMonthly, prices }: OrderPriceProps) => {
  const { t } = useTranslation('pricing');
  const decimals = showMonthly ? 2 : 3;
  const unit = showMonthly ? 'monthly' : 'hourly';
  const price = prices.servicePrice[unit];
  return (
    <Table>
      <TableBody>
        <TableRow className="text-xs">
          <TableCell>Instance</TableCell>
          <TableCell className="text-right px-0">
            <Price
              className="flex flex-row justify-end items-center flex-wrap gap-2"
              decimals={3}
              priceInUcents={prices.flavorPrice.hourly.price}
              taxInUcents={prices.flavorPrice.hourly.tax}
            />
          </TableCell>
        </TableRow>
        <TableRow className="text-xs">
          <TableCell>Storage</TableCell>
          <TableCell className="text-right px-0">
            <Price
              className="flex flex-row justify-end items-center flex-wrap gap-2"
              decimals={3}
              priceInUcents={prices.storagePrice.hourly.price}
              taxInUcents={prices.storagePrice.hourly.tax}
            />
          </TableCell>
        </TableRow>
        <TableRow className="text-xs">
          <TableCell>Backup</TableCell>
          <TableCell className="text-right px-0">
            <Price 
              className="flex flex-row justify-end items-center flex-wrap gap-2"
              decimals={3} priceInUcents={0} taxInUcents={0} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold text-text">
            Total per hour
          </TableCell>
          <TableCell className="text-right px-0">
            <Price
              className="flex flex-row justify-end items-center flex-wrap gap-2"
              decimals={3}
              priceInUcents={prices.servicePrice.hourly.price}
              taxInUcents={prices.servicePrice.hourly.tax}
            />
          </TableCell>
        </TableRow>
        <TableRow className="text-sm text-gray-500 italic">
          <TableCell>Monthly (estimated)</TableCell>
          <TableCell className="text-right px-0">
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
    // <div className='grid grid-cols-2'>
    //   <span
    //     className="text-sm">Instance</span>
    //   <Price
    //     className="text-sm"
    //     decimals={decimals}
    //     priceInUcents={prices.flavorPrice[unit].price}
    //     taxInUcents={prices.flavorPrice[unit].tax}
    //   />
    //   <span
    //     className="text-sm">Storage</span>
    //   <Price
    //     className="text-sm"
    //     decimals={decimals}
    //     priceInUcents={prices.storagePrice[unit].price}
    //     taxInUcents={prices.storagePrice[unit].tax}
    //   />
    //    <span
    //     className="text-sm">Backup</span>
    //   <Price
    //     className="text-sm"
    //     decimals={decimals}
    //     priceInUcents={0}
    //     taxInUcents={0}
    //   />
    //   <span className='font-semibold'>Total (hourly)</span>
    //   <Price
    //     decimals={decimals}
    //     priceInUcents={prices.servicePrice[unit].price}
    //     taxInUcents={prices.servicePrice[unit].tax}
    //   />
    //   <span className='text-xs text-gray-500'>Monthly (estimated)</span>
    //   <Price
    //     className="text-xs text-gray-500"
    //     decimals={0}
    //     priceInUcents={prices.servicePrice.monthly.price}
    //     taxInUcents={prices.servicePrice.monthly.tax}
    //   />
    // </div>
  );
};

export default OrderPrice2;
