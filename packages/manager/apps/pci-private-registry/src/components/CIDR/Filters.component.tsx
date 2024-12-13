import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';

import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
} from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';
import {
  Filter,
  FilterCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import {
  FilterAdd,
  useColumnFilters,
  useDataGrid,
  FilterList,
} from '@ovh-ux/manager-react-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useMemo, memo } from 'react';

import { useIpRestrictions } from '@/api/hooks/useIpRestrictions';

import DeleteModal from './DeleteModal.component';

const Filters = ({
  createNewRow,
  addFilter,
  removeFilter,
  filters,
}: {
  createNewRow: () => void;
  addFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
  filters: Filter[];
}) => {
  const [searchField, setSearchField] = useState('');
  const { projectId, registryId } = useParams();
  const filterPopoverRef = useRef(undefined);
  const { pagination, setPagination } = useDataGrid();
  const { data } = useIpRestrictions(projectId, registryId);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { t } = useTranslation(['ip-restrictions']);

  const showDeleteButton = useMemo(
    () => data.filter((item) => item.checked).length >= 2,
    [data],
  );

  const draftModeEnabled = useMemo(() => data.some((item) => item.draft), [
    data,
  ]);
  const { filters: filtersColumn } = useColumnFilters();

  return (
    <>
      <div className="sm:flex items-center justify-between mt-4">
        <div className="flex flex-wrap gap-4">
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="xs:mb-0.5 sm:mb-0"
            disabled={draftModeEnabled || undefined}
            onClick={() => {
              createNewRow();
            }}
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
              onClick={() => setOpenDeleteModal(true)}
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
        {openDeleteModal && (
          <DeleteModal onClose={() => setOpenDeleteModal(false)} all />
        )}

        <div className="justify-between flex">
          <OsdsSearchBar
            className="w-[70%]"
            value={searchField}
            onOdsSearchSubmit={({ detail }) => {
              setPagination({
                pageIndex: 0,
                pageSize: pagination.pageSize,
              });
              addFilter({
                key: 'ipBlock',
                value: detail.inputValue,
                comparator: FilterComparator.Includes,
                label: '',
              } as Filter & { label: string });
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
                    id: 'cidr',
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
                  setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize,
                  });
                  addFilter({
                    ...addedFilter,
                    label: column.label,
                  } as Filter & { label: string });
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
