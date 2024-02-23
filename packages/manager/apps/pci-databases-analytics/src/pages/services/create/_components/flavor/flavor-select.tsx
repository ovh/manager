import React from 'react';
import Price from '@/components/price';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatStorage } from '@/lib/bytesHelper';
import { Flavor } from '@/models/order-funnel';

interface FlavorsSelectProps {
  flavors: Flavor[];
  value: string;
  onChange: (newFlavor: string) => void;
  showMonthlyPrice?: boolean;
}

const FlavorsSelect = React.forwardRef<HTMLInputElement, FlavorsSelectProps>(
  ({ flavors, value, onChange, showMonthlyPrice = false }, ref) => {
    const Storage = ({ flavor }: { flavor: Flavor }) => {
      const { storage } = flavor;
      if (!storage) return '-';
      if (
        storage.minimum.value === storage.maximum.value &&
        storage.minimum.unit === storage.maximum.unit
      )
        return formatStorage(storage.minimum);
      return `De ${formatStorage(storage.minimum)} à ${formatStorage(
        storage.maximum,
      )}`;
    };
    const clickInput = (flavorName: string) => {
      const inputElement = document.getElementById(
        `flavor-${flavorName}`,
      ) as HTMLInputElement | null;
      if (inputElement) {
        inputElement.click();
      }
    };
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLTableRowElement>,
      flavorName: string,
    ) => {
      if (e.key === 'Enter') {
        clickInput(flavorName);
      }
    };
    return (
      <div ref={ref}>
        <Table>
          <TableHeader>
            <TableRow className="bg-primary-100 hover:bg-primary-10">
              <TableHead className="font-bold text-base text-[#4d5592]">
                Type
              </TableHead>
              <TableHead className="font-bold text-base text-[#4d5592]">
                vCores
              </TableHead>
              <TableHead className="font-bold text-base text-[#4d5592]">
                Mémoire
              </TableHead>
              <TableHead className="font-bold text-base text-[#4d5592]">
                Stockage utile
              </TableHead>
              <TableHead className="font-bold text-base text-[#4d5592]">
                Coût/heure/nœud (estimé)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flavors
              .sort((a, b) => a.order - b.order)
              .map((flavor) => (
                <TableRow
                  tabIndex={0}
                  onClick={() => clickInput(flavor.name)}
                  onKeyDown={(e) => handleKeyDown(e, flavor.name)}
                  key={flavor.name}
                  className={`border border-primary-100 hover:bg-primary-50 cursor-pointer text-[#4d5592] ${
                    value === flavor.name ? 'bg-[#DEF8FF] font-bold' : ''
                  }`}
                >
                  <td className="hidden">
                    <input
                      type="radio"
                      name="flavor-select"
                      onChange={(e) => onChange(e.target.value)}
                      className="hidden"
                      id={`flavor-${flavor.name}`}
                      value={flavor.name}
                      checked={value === flavor.name}
                    />
                  </td>
                  <TableCell className="text-[#4d5592] border border-primary-100 capitalize">
                    {flavor.name}
                  </TableCell>
                  <TableCell className="text-[#4d5592] border border-primary-100">
                    {flavor.vcores ?? '-'}
                  </TableCell>
                  <TableCell className="text-[#4d5592] border border-primary-100">
                    {flavor.ram
                      ? `${flavor.ram.value} ${flavor.ram.unit}`
                      : '-'}
                  </TableCell>
                  <TableCell className="text-[#4d5592] border border-primary-100">
                    <Storage flavor={flavor} />
                  </TableCell>
                  <TableCell className="text-[#4d5592] border border-primary-100">
                    <Price
                      priceInUcents={
                        flavor.pricing[showMonthlyPrice ? 'monthly' : 'hourly']
                          .price
                      }
                      taxInUcents={
                        flavor.pricing[showMonthlyPrice ? 'monthly' : 'hourly']
                          .tax
                      }
                      decimals={showMonthlyPrice ? 2 : 3}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  },
);

FlavorsSelect.displayName = 'FlavorsSelect';

export default FlavorsSelect;
