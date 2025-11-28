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
  RadioGroup,
  RadioTile,
  RadioIndicator,
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
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLTableRowElement>,
      flavorName: string,
    ) => {
      if (e.key === 'Enter') {
        onChange(flavorName);
      }
    };
    const classNameTableHead =
      'p-3 h-10 border font-semibold text-primary-800';
    const classNameTableCell = 'p-3 text-[#4d5592] border';
    return (
      <Table
        data-testid="flavor-select-table"
        ref={ref}
        className={cn('table-fixed max-w-full overflow-x-auto', className)}
      >
        <TableHeader
          data-testid="flavor-select-table-header"
          className="border bg-[#f7f8f8]"
        >
          <TableRow>
            <TableHead className={classNameTableHead}>
              {t('tableHeadType')}
            </TableHead>
            <TableHead className={classNameTableHead}>
              {t('tableHeadCores')}
            </TableHead>
            <TableHead className={classNameTableHead}>
              {t('tableHeadMemory')}
            </TableHead>
            <TableHead className={classNameTableHead}>
              {t('tableHeadStorage')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="flavor-select-table-body">
          <RadioGroup
            value={value}
            className="contents"
            onValueChange={onChange}
          >
            {flavors.map((flavor, key) => (
              <RadioTile value={flavor.name} className="contents" key={key}>
                <TableRow
                  data-testid={`flavor-table-row-${flavor.name}`}
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, flavor.name)}
                  key={flavor.name}
                  className={`border hover:bg-primary-50 cursor-pointer text-[#4d5592] ${
                    value === flavor.name
                      ? 'bg-primary-50 font-semibold !border-2 border-primary-500'
                      : ''
                  }`}
                >
                  <TableCell className={cn(classNameTableCell, 'capitalize')}>
                    <div className="flex gap-2 w-full items-center flex-nowrap">
                      <RadioIndicator />
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
                  <TableCell className={classNameTableCell}>
                    {flavor.vcores ?? '-'}
                  </TableCell>
                  <TableCell className={classNameTableCell}>
                    {flavor.ram ? `${formatStorage(flavor.ram)}` : '-'}
                  </TableCell>
                  <TableCell className={classNameTableCell}>
                    <Storage flavor={flavor} />
                  </TableCell>
                </TableRow>
              </RadioTile>
            ))}
          </RadioGroup>
        </TableBody>
      </Table>
    );
  },
);

FlavorsSelect.displayName = 'FlavorsSelect';

export default FlavorsSelect;
