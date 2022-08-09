import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Portal,
  VStack,
} from '@chakra-ui/react';
import { SettingsIcon } from '@ovh-ux/manager-themes';
import { ListingColumn } from './Listing';

export type ListingColumnTogglerProps<T> = {
  columns: ListingColumn<T>[];
  onColumnVisibilityChange: (
    column: ListingColumn<T>,
    isVisible: boolean,
  ) => void;
};

export default function ListingColumnToggler<T>({
  columns,
  onColumnVisibilityChange,
}: ListingColumnTogglerProps<T>): JSX.Element {
  const { t } = useTranslation('common');
  const visibleColumns = columns.filter((c) => !c.hidden);

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <IconButton
          aria-label={t('columns')}
          icon={<SettingsIcon />}
          variant="ghost"
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <form
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <VStack align="right">
                {columns.map((column) => (
                  <Checkbox
                    key={column.key}
                    isChecked={!column.hidden}
                    isDisabled={visibleColumns.length === 1 && !column.hidden}
                    onChange={(e) => {
                      onColumnVisibilityChange(column, e.target.checked);
                    }}
                  >
                    {column.label}
                  </Checkbox>
                ))}
              </VStack>
            </form>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
