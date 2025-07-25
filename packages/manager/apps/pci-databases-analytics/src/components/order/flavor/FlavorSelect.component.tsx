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
import { formatStorage } from '@/lib/bytesHelper';
import { Flavor } from '@/types/orderFunnel';
import { getTagVariant } from '@/lib/tagsHelper';
import { cn } from '@/lib/utils';

interface FlavorsSelectProps {
  flavors: Flavor[];
  value: string;
  onChange: (newFlavor: string) => void;
  className?: string;
}

const FlavorsSelect = React.forwardRef<HTMLTableElement, FlavorsSelectProps>(
  ({ flavors, value, onChange, className }, ref) => {
    const { t } = useTranslation('pci-databases-analytics/components/flavor');

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
        className={cn('table-auto max-w-full overflow-x-auto', className)}
      >
        <TableHeader data-testid="flavor-select-table-header">
          <TableRow className="bg-primary-100 hover:bg-primary-10">
            <TableHead className="font-bold text-base text-[#4d5592]">
              {t('tableHeadType')}
            </TableHead>
            <TableHead className="font-bold text-base text-[#4d5592]">
              {t('tableHeadCores')}
            </TableHead>
            <TableHead className="font-bold text-base text-[#4d5592]">
              {t('tableHeadMemory')}
            </TableHead>
            <TableHead className="font-bold text-base text-[#4d5592]">
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
              <TableCell className="text-[#4d5592] border border-primary-100">
                {flavor.vcores ?? '-'}
              </TableCell>
              <TableCell className="text-[#4d5592] border border-primary-100">
                {flavor.ram ? `${formatStorage(flavor.ram)}` : '-'}
              </TableCell>
              <TableCell className="text-[#4d5592] border border-primary-100">
                <Storage flavor={flavor} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
);

FlavorsSelect.displayName = 'FlavorsSelect';

export default FlavorsSelect;
