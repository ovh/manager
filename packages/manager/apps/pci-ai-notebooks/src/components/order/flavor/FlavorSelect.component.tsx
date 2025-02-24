import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Zap } from 'lucide-react';
import Price from '@/components/price/Price.component';
import * as ai from '@/types/cloud/project/ai';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { bytesConverter } from '@/lib/bytesHelper';
import { Flavor } from '@/types/orderFunnel';
import { FormLabel } from '@/components/ui/form';

interface FlavorsSelectProps {
  flavors: Flavor[];
  value: string;
  resourcesQuantity: number;
  onChange: (newFlavor: string) => void;
  className?: string;
}

const FlavorsSelect = React.forwardRef<HTMLTableElement, FlavorsSelectProps>(
  ({ flavors, value, resourcesQuantity, onChange, className }, ref) => {
    const { t } = useTranslation('components/flavor');

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
      <>
        <FormLabel className="scroll-m-20 text-xl font-semibold">
          {t('fieldFlavorLabel')}
        </FormLabel>
        <p className="text-sm">{t('fieldFlavorDescription')}</p>
        <Table
          data-testid="flavor-select-table"
          ref={ref}
          className={cn('min-w-max w-full', className)}
        >
          <TableHeader
            className="border border-primary-100"
            data-testid="flavor-select-table-header"
          >
            <TableRow className="bg-primary-100 hover:bg-primary-10">
              <TableHead className="font-bold text-base text-[#4d5592]">
                {t('tableHeadType')}
              </TableHead>
              <TableHead className="font-bold text-base text-[#4d5592]">
                {t('tableHeadDescription')}
              </TableHead>
              <TableHead className="font-bold text-base text-[#4d5592]">
                {t('tableHeadVcores')}
              </TableHead>
              <TableHead className="font-bold text-base text-[#4d5592]">
                {t('tableHeadMemory')}
              </TableHead>
              <TableHead className="font-bold text-base text-[#4d5592]">
                {t('tableHeadStorage')}
              </TableHead>
              <TableHead className="font-bold text-base text-[#4d5592]">
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
                className={`border border-primary-100 hover:bg-primary-50 cursor-pointer text-[#4d5592] ${
                  value === flavor.id ? 'bg-[#DEF8FF] font-bold' : ''
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
                <TableCell className="text-[#4d5592] border border-primary-100 capitalize">
                  <div className="flex gap-2 w-full items-center">
                    {flavor.type === ai.capabilities.FlavorTypeEnum.cpu ? (
                      <Cpu className="size-4" />
                    ) : (
                      <Zap className="size-4" />
                    )}
                    <span>{flavor.id}</span>
                  </div>
                </TableCell>
                <TableCell className="text-[#4d5592] border border-primary-100">
                  {flavor.description}
                </TableCell>
                <TableCell className="text-[#4d5592] border border-primary-100">
                  {resourcesQuantity * flavor.resourcesPerUnit.cpu}
                </TableCell>
                <TableCell className="text-[#4d5592] border border-primary-100">
                  {bytesConverter(
                    resourcesQuantity * flavor.resourcesPerUnit.memory,
                    false,
                    0,
                  )}
                </TableCell>
                <TableCell className="text-[#4d5592] border border-primary-100">
                  {bytesConverter(
                    resourcesQuantity *
                      flavor.resourcesPerUnit.ephemeralStorage,
                    false,
                    0,
                  )}
                </TableCell>
                <TableCell className="text-[#4d5592] border border-primary-100">
                  <Price
                    priceInUcents={
                      60 * resourcesQuantity * flavor.pricing[0]?.price
                    }
                    taxInUcents={
                      60 * resourcesQuantity * flavor.pricing[0]?.tax
                    }
                    decimals={2}
                    displayInHour={true}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  },
);

FlavorsSelect.displayName = 'FlavorsSelect';

export default FlavorsSelect;
