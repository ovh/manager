import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Portal,
  Select,
  VStack,
} from '@chakra-ui/react';
import { FilterIcon } from '@ovh-ux/manager-themes';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';

import { ListingColumn } from './Listing';

export type ListingFilterAdderProps<T> = {
  columns: ListingColumn<T>[];
  onAdd: (
    column: ListingColumn<T>,
    value: string,
    comparator: FilterComparator,
  ) => void;
};

export default function ListingFilterAdder<T>({
  columns,
  onAdd,
}: ListingFilterAdderProps<T>): JSX.Element {
  const { t } = useTranslation('listing');
  if (!columns?.length) {
    return undefined;
  }
  const [isOpen, setIsOpen] = useState(false);
  const [column, setColumn] = useState(columns[0]);
  const [comparator, setComparator] = useState<FilterComparator>();
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setComparator(column.filterable[0]);
  }, [column]);

  return (
    <Popover isOpen={isOpen} onClose={() => setIsOpen(false)} placement="auto">
      <PopoverTrigger>
        <Button
          leftIcon={<FilterIcon />}
          onClick={() => setIsOpen(!isOpen)}
          variant="secondary"
        >
          {t('filter')}
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onAdd(column, value, comparator);
                setValue('');
                setIsOpen(false);
              }}
            >
              <VStack>
                <FormControl>
                  <FormLabel>{t('column')}</FormLabel>
                  <Select
                    value={column.key}
                    onChange={(e) =>
                      setColumn(columns.find((f) => f.key === e.target.value))
                    }
                  >
                    {columns.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>{t('condition')}</FormLabel>
                  <Select
                    value={comparator}
                    onChange={(e) =>
                      setComparator(e.target.value as FilterComparator)
                    }
                  >
                    {column.filterable.map((comp) => (
                      <option key={comp} value={comp}>
                        {t(`filter_${comp}`)}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>{t('value')}</FormLabel>
                  <Input
                    value={value}
                    type={
                      column.filterable === FilterCategories.Numeric
                        ? 'number'
                        : 'text'
                    }
                    onChange={(event) => setValue(event.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  width={{ base: '100%' }}
                  disabled={value === ''}
                  onClick={() => {}}
                >
                  {t('add')}
                </Button>
              </VStack>
            </form>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
