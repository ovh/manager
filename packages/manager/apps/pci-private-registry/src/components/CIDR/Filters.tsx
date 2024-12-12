import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { useFormContext } from 'react-hook-form';
import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
} from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import {
  FilterAdd,
  useColumnFilters,
  useDataGrid,
  FilterList,
  useNotifications,
} from '@ovh-ux/manager-react-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useMemo, memo, useCallback } from 'react';

import {
  useIpRestrictions,
  useUpdateIpRestriction,
} from '@/api/hooks/useIpRestrictions';
import { categorizeByKey } from '@/helpers';
import {
  FilterRestrictionsServer,
  TIPRestrictionsDefault,
  TIPRestrictionsMethodEnum,
} from '@/types';

const Filters = ({ createNewRow }: { createNewRow: () => void }) => {
  const [searchField, setSearchField] = useState('');
  const { projectId, registryId } = useParams();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const { reset } = useFormContext();
  const filterPopoverRef = useRef(undefined);
  const { pagination, setPagination } = useDataGrid();
  const { data } = useIpRestrictions(projectId, registryId);

  const { t } = useTranslation(['ip-restrictions']);
  const { addSuccess, addError } = useNotifications();
  const showDeleteButton = useMemo(
    () => data.filter((item) => item.checked).length >= 2,
    [data],
  );

  const { updateIpRestrictions } = useUpdateIpRestriction({
    projectId,
    registryId,
    onError: () => {
      addError(t('common:private_registry_crud_cidr_error'));
    },
    onSuccess: () => {
      reset();
      addSuccess(t('private_registry_cidr_delete_all_success'), true);
    },
  });

  const deleteAllSelectedRows = useCallback(() => {
    const rowToDelete = data
      .filter((item) => item.checked)
      .map((item) => ({
        ipBlock: item.ipBlock,
        authorization: item.authorization,
        description: item.description,
      }));

    const categorizeByKeyResult = categorizeByKey(
      rowToDelete,
      'authorization',
      ['management', 'registry'],
    );
    updateIpRestrictions({
      cidrToUpdate: categorizeByKeyResult as Record<
        FilterRestrictionsServer,
        TIPRestrictionsDefault[]
      >,
      action: TIPRestrictionsMethodEnum.DELETE,
    });
  }, [data, updateIpRestrictions]);

  const DraftModeEnabled = useMemo(() => data.some((item) => item.draft), [
    data,
  ]);

  return (
    <>
      <div className="sm:flex items-center justify-between mt-4">
        <div className="flex flex-wrap gap-4">
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="xs:mb-0.5 sm:mb-0"
            disabled={DraftModeEnabled || undefined}
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
              onClick={deleteAllSelectedRows}
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
              addFilter({
                key: 'name',
                value: detail.inputValue,
                comparator: FilterComparator.Includes,
                label: '',
              });
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
                    id: 'authorized',
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
                  });
                  filterPopoverRef.current?.closeSurface();
                }}
              />
            </OsdsPopoverContent>
          </OsdsPopover>
        </div>
      </div>
      <div className="my-5">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>
    </>
  );
};

export default memo(Filters);
