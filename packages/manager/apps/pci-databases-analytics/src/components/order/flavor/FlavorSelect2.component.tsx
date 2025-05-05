import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@datatr-ux/uxlib';
import Price from '@/components/price/Price.component';
import { formatStorage } from '@/lib/bytesHelper';
import { Flavor } from '@/types/orderFunnel';
import { getTagVariant } from '@/lib/tagsHelper';
import { cn } from '@/lib/utils';

interface FlavorsSelectProps {
  flavors: Flavor[];
  value: string;
  onChange: (newFlavor: string) => void;
  showMonthlyPrice?: boolean;
  className?: string;
}

const FlavorsSelect2 = React.forwardRef<HTMLTableElement, FlavorsSelectProps>(
  ({ flavors, value, onChange, showMonthlyPrice = false, className }, ref) => {
    const { t } = useTranslation('pci-databases-analytics/components/flavor');
    const priceUnit = showMonthlyPrice ? 'monthly' : 'hourly';
    const decimals = showMonthlyPrice ? 2 : 3;

    const Storage = ({ flavor }: { flavor: Flavor }) => {
      const { storage } = flavor;
      if (!storage) return '-';
      if (
        storage.minimum.value === storage.maximum.value &&
        storage.minimum.unit === storage.maximum.unit
      ) {
        return formatStorage(storage.minimum);
      }
      return t('tableCellStorageRange', {
        min: formatStorage(storage.minimum),
        max: formatStorage(storage.maximum),
      });
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
      <Table
        data-testid="flavor-select-table"
        ref={ref}
        className={cn('table-fixed max-w-full overflow-x-auto', className)}
      >
        <TableHeader data-testid="flavor-select-table-header"  className="border bg-[#f7f8f8]">
          <TableRow>
            <TableHead className="h-10 px-2 border font-semibold text-primary-800">
              {t('tableHeadType')}
            </TableHead>
            <TableHead className="h-10 px-2 border font-semibold text-primary-800">
              {t('tableHeadCores')}
            </TableHead>
            <TableHead className="h-10 px-2 border font-semibold text-primary-800">
              {t('tableHeadMemory')}
            </TableHead>
            <TableHead className="h-10 px-2 border font-semibold text-primary-800">
              {t('tableHeadStorage')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="flavor-select-table-body">
          {flavors.map((flavor) => (
            <TableRow
              data-testid={`flavor-table-row-${flavor.name}`}
              tabIndex={0}
              onClick={() => clickInput(flavor.name)}
              onKeyDown={(e) => handleKeyDown(e, flavor.name)}
              key={flavor.name}
              className={`border hover:bg-primary-50 cursor-pointer text-[#4d5592] ${
                value === flavor.name ? 'bg-primary-50 font-semibold !border-2 border-primary-500' : ''
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
              <TableCell className="text-[#4d5592] border capitalize">
                <div className="flex gap-2 w-full justify-between items-center flex-nowrap">
                  <span>{flavor.name}</span>
                  <div className="hidden md:flex gap-1">
                    {flavor.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={getTagVariant(tag)}
                        className="text-xs h-4"
                      >
                        {t(`flavorTag-${tag}`, tag)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-[#4d5592] border">
                {flavor.vcores ?? '-'}
              </TableCell>
              <TableCell className="text-[#4d5592] border">
                {flavor.ram ? `${formatStorage(flavor.ram)}` : '-'}
              </TableCell>
              <TableCell className="text-[#4d5592] border">
                <Storage flavor={flavor} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
);

FlavorsSelect2.displayName = 'FlavorsSelect2';

export default FlavorsSelect2;
