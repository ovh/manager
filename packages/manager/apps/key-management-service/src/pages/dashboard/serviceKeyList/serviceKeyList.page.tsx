import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_SPINNER_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsText,
  OsdsMessage,
  OsdsSpinner,
  OsdsButton,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  useDatagridSearchParams,
} from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
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
import { ROUTES_URLS } from '@/routes/routes.constants';

export default function Keys() {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { t: tError } = useTranslation('error');
  const navigate = useNavigate();
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
      <OsdsButton
        size={ODS_BUTTON_SIZE.sm}
        inline
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        className={'xs:mt-2 sm:mt-0 md:mt-8 w-fit h-fit'}
        onClick={() => {
          navigate(ROUTES_URLS.createKmsServiceKey);
        }}
      >
        <span slot="start">
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          ></OsdsIcon>
        </span>

        {t('key_management_service_service-keys_cta_create')}
      </OsdsButton>
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
