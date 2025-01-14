import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
} from '@ovhcloud/ods-components/react';

import {
  Filter,
  FilterCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';

import {
  FilterAdd,
  useColumnFilters,
  FilterList,
} from '@ovh-ux/manager-react-components';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useMemo, memo } from 'react';
import useDataGridContext from '@/pages/CIDR/useDatagridContext';
import { categorizeByKey } from '@/helpers';
import { FilterRestrictionsServer } from '@/types';

const getCategorizedRestrictions = (
  rows: {
    ipBlock: string;
    description: string | null;
    authorization: FilterRestrictionsServer[] | null;
  }[],
) => categorizeByKey(rows, 'authorization', ['management', 'registry']);

const Filters = () => {
  const [searchField, setSearchField] = useState('');
  const navigate = useNavigate();
  const filterPopoverRef = useRef<HTMLOsdsPopoverElement | null>(null);
  const {
    rows: data,
    totalRows,
    filters,
    pagination,
    setPagination,
    addFilter,
    removeFilter,
    addNewRow,
  } = useDataGridContext();

  const { t } = useTranslation(['ip-restrictions']);

  const showDeleteButton = useMemo(
    () => data.filter((item) => item.checked).length >= 2,
    [data],
  );

  const draftModeEnabled = useMemo(() => data.some((item) => item.draft), [
    data,
  ]);

  const { filters: filtersColumn } = useColumnFilters();

  const handleAddFilter = (
    inputValue: string | string[],
    key = 'ipBlock',
    label = '',
    comparator = FilterComparator.Includes,
  ) => {
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
    addFilter({
      key,
      value: inputValue,
      comparator,
      label,
    } as Filter & { label: string });
  };

  return (
    <>
      <div className="sm:flex items-center justify-between mt-4">
        <div className="flex flex-wrap gap-4">
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="xs:mb-0.5 sm:mb-0"
            disabled={draftModeEnabled || undefined}
            onClick={() => addNewRow()}
          >
            <OsdsIcon
              size={ODS_ICON_SIZE.xs}
              name={ODS_ICON_NAME.PLUS}
              className="mr-2"
              contrasted
              color={ODS_THEME_COLOR_INTENT.primary}
            />
            {t('ip_restrictions_add_block')}
          </OsdsButton>

          {showDeleteButton && (
            <OsdsButton
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.stroked}
              color={ODS_THEME_COLOR_INTENT.primary}
              className="xs:mb-0.5 sm:mb-0"
              onClick={() => {
                const rowsToDelete = data
                  .filter((item) => item.checked)
                  .map(({ ipBlock, authorization, description }) => ({
                    ipBlock,
                    authorization,
                    description,
                  }));
                const categorizedRestrictions = getCategorizedRestrictions(
                  rowsToDelete,
                );
                navigate('./delete', {
                  state: {
                    cidr: categorizedRestrictions,
                    totalRows,
                    filters,
                    pagination,
                  },
                });
              }}
            >
              <OsdsIcon
                size={ODS_ICON_SIZE.xs}
                name={ODS_ICON_NAME.TRASH}
                className="mr-2"
                color={ODS_THEME_COLOR_INTENT.primary}
              />
              {t('ip_restrictions_delete_multiple_block')}
            </OsdsButton>
          )}
        </div>

        <div className="justify-between flex">
          <OsdsSearchBar
            className="w-[70%]"
            value={searchField}
            onOdsSearchSubmit={({ detail }) => {
              setPagination({
                pageIndex: 0,
                pageSize: pagination.pageSize,
              });
              handleAddFilter(detail.inputValue);
              setSearchField('');
            }}
          />
          <OsdsPopover ref={filterPopoverRef}>
            <OsdsButton
              slot="popover-trigger"
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.stroked}
            >
              <OsdsIcon
                name={ODS_ICON_NAME.FILTER}
                size={ODS_ICON_SIZE.xs}
                className="mr-2"
                color={ODS_THEME_COLOR_INTENT.primary}
              />
              {t('common:common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'ipBlock',
                    label: t('private_registry_bloc_cidr'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'authorization',
                    label: t('private_registry_cidr_authorization'),
                    comparators: FilterCategories.String,
                  },
                ]}
                onAddFilter={(addedFilter, column) => {
                  handleAddFilter(
                    addedFilter.value,
                    column.id,
                    column.label,
                    addedFilter.comparator,
                  );
                  filterPopoverRef.current?.closeSurface();
                }}
              />
            </OsdsPopoverContent>
          </OsdsPopover>
        </div>
      </div>
      <div className="my-5">
        <FilterList
          filters={filters as typeof filtersColumn}
          onRemoveFilter={removeFilter}
        />
      </div>
    </>
  );
};

export default memo(Filters);
