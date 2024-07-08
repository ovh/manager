import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ODS_SPINNER_SIZE, ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import {
  OsdsText,
  OsdsMessage,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  Notifications,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  DatagridCellType,
  DatagridCreationDate,
  DatagridServiceKeyActionMenu,
  DatagridServiceKeyCellId,
  DatagridServiceKeyCellName,
  DatagridStatus,
} from '@/components/Listing/ListingCells';
import { useOkmsServiceKeys } from '@/data/hooks/useOkmsServiceKeys';

export default function Keys() {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { t: tError } = useTranslation('error');

  const columns = [
    {
      id: 'name',
      cell: DatagridServiceKeyCellName,
      label: t('key_management_service_service-keys_column_name'),
    },
    {
      id: 'id',
      cell: DatagridServiceKeyCellId,
      label: t('key_management_service_service-keys_column_id'),
    },
    {
      id: 'type',
      cell: DatagridCellType,
      label: t('key_management_service_service-keys_column_type'),
    },
    {
      id: 'creation_date',
      cell: DatagridCreationDate,
      label: t('key_management_service_service-keys_column_created-at'),
    },
    {
      id: 'status',
      cell: DatagridStatus,
      label: t('key_management_service_service-keys_column_state'),
    },
    {
      id: 'action',
      cell: DatagridServiceKeyActionMenu,
      isSortable: false,
      label: '',
    },
  ];

  const { sorting, setSorting } = useDatagridSearchParams();
  const { okmsId } = useParams();
  const { error, data: okmsServiceKey, isLoading } = useOkmsServiceKeys({
    sorting,
    okmsId,
  });

  return (
    <>
      <Notifications />
      <div className={'flex mb-3 mt-6'}>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
        >
          {t('key_management_service_service-keys_headline')}
        </OsdsText>
      </div>
      {error && (
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.error}>
          {tError('manager_error_page_default')}
        </OsdsMessage>
      )}

      {isLoading && !error && (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}
      {!isLoading && !error && (
        <div className={'mt-8'}>
          <Datagrid
            columns={columns}
            items={okmsServiceKey || []}
            totalItems={0}
            sorting={sorting}
            onSortChange={setSorting}
            contentAlignLeft
          />
        </div>
      )}
      <Outlet />
    </>
  );
}
