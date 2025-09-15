import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Zap } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@datatr-ux/uxlib';
import { cn } from '@/lib/utils';
import { bytesConverter } from '@/lib/bytesHelper';
import { Flavor } from '@/types/orderFunnel';
import ai from '@/types/AI';
import Price from '@/components/price/Price.component';

interface FlavorsSelectProps {
  flavors: Flavor[];
  value: string;
  resourcesQuantity: number;
  onChange: (newFlavor: string) => void;
  className?: string;
  isUpdate?: boolean;
}

const FlavorsSelect = React.forwardRef<HTMLTableElement, FlavorsSelectProps>(
  (
    { flavors, value, resourcesQuantity, onChange, isUpdate, className },
    ref,
  ) => {
    const { t } = useTranslation('ai-tools/components/flavor');

    flavors.sort((a, b) => a.pricing[0].price - b.pricing[0].price);

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
        className={cn('min-w-max w-full', className)}
      >
        <TableHeader
          className="border bg-[#f7f8f8]"
          data-testid="flavor-select-table-header"
        >
          <TableRow>
            <TableHead className="h-10 px-2 border font-semibold text-primary-800">
              {t('tableHeadType')}
            </TableHead>
            {!isUpdate && (
              <TableHead className="h-10 px-2 border font-semibold text-primary-800">
                {t('tableHeadDescription')}
              </TableHead>
            )}
            <TableHead className="h-10 px-2 border font-semibold text-primary-800">
              {t('tableHeadVcores')}
            </TableHead>
            <TableHead className="h-10 px-2 border font-semibold text-primary-800">
              {t('tableHeadMemory')}
            </TableHead>
            <TableHead className="h-10 px-2 border font-semibold text-primary-800">
              V{t('tableHeadMemory')}
            </TableHead>
            {!isUpdate && (
              <TableHead className="h-10 px-2 border font-semibold text-primary-800">
                {t('tableHeadStorage')}
              </TableHead>
            )}
            <TableHead className="h-10 px-2 border font-semibold text-primary-800">
              {t('tableHeadPrice')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="flavor-select-table-body">
          {flavors.map((flavor) => (
            <TableRow
              data-testid={`flavor-table-row-${flavor.id}`}
              tabIndex={0}
              onClick={() => clickInput(flavor.id)}
              onKeyDown={(e) => handleKeyDown(e, flavor.id)}
              key={flavor.id}
              className={`border hover:bg-primary-50 cursor-pointer text-[#4d5592] ${
                value === flavor.id
                  ? 'bg-primary-50 font-semibold !border-2 border-primary-500'
                  : ''
              }`}
            >
              <td className="hidden">
                <input
                  type="radio"
                  name="flavor-select"
                  onChange={(e) => onChange(e.target.value)}
                  className="hidden"
                  id={`flavor-${flavor.id}`}
                  value={flavor.id}
                  checked={value === flavor.id}
                />
              </td>
              <TableCell className="text-[#4d5592] border capitalize">
                <div className="flex gap-2 w-full items-center">
                  {flavor.type === ai.capabilities.FlavorTypeEnum.cpu ? (
                    <Cpu className="size-4" />
                  ) : (
                    <Zap className="size-4" />
                  )}
                  <span>{flavor.id}</span>
                </div>
              </TableCell>
              {!isUpdate && (
                <TableCell className="text-[#4d5592] border capitalize">
                  {flavor.description}
                </TableCell>
              )}
              <TableCell className="text-[#4d5592] border capitalize">
                {resourcesQuantity * flavor.resourcesPerUnit.cpu}
              </TableCell>
              <TableCell className="text-[#4d5592] border capitalize">
                {bytesConverter(
                  resourcesQuantity * flavor.resourcesPerUnit.memory,
                  false,
                  0,
                )}
              </TableCell>
              {flavor.type === ai.capabilities.FlavorTypeEnum.cpu ? (
                <TableCell className="text-[#4d5592] border capitalize text-center">
                  -
                </TableCell>
              ) : (
                <TableCell className="text-[#4d5592] border capitalize">
                  {bytesConverter(
                    resourcesQuantity * flavor.gpuInformation?.gpuMemory,
                    false,
                    0,
                  )}
                </TableCell>
              )}
              {!isUpdate && (
                <TableCell className="text-[#4d5592] border capitalize">
                  {bytesConverter(
                    resourcesQuantity *
                      flavor.resourcesPerUnit.ephemeralStorage,
                    false,
                    0,
                  )}
                </TableCell>
              )}
              <TableCell className="text-[#4d5592] border capitalize">
                <Price
                  priceInUcents={
                    60 * resourcesQuantity * flavor.pricing[0]?.price
                  }
                  taxInUcents={60 * resourcesQuantity * flavor.pricing[0]?.tax}
                  decimals={2}
                  displayInHour={false}
                />
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
