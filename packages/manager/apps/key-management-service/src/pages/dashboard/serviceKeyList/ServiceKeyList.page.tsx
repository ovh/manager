import React, { useContext } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import {
  ODS_MESSAGE_TYPE,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  Description,
  ErrorBanner,
  ManagerButton,
  useDatagridSearchParams,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
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
import { OkmsContext } from '..';
import Loading from '@/components/Loading/Loading';
import { getOkmsServiceKeyResourceListQueryKey } from '@/data/api/okmsServiceKey';

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
  const okms = useContext(OkmsContext);
  const { okmsId } = useParams();
  const { error, data: okmsServiceKey, isLoading } = useOkmsServiceKeys({
    sorting,
    okmsId,
  });

  if (isLoading) return <Loading />;

  if (error)
    return (
      <ErrorBanner
        error={error}
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
          })
        }
      />
    );

  return (
    <div className="flex flex-col gap-8">
      <Description>
        {t('key_management_service_service-keys_headline')}
      </Description>
      {error && (
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.error}>
          {tError('manager_error_page_default')}
        </OsdsMessage>
      )}
      <div>
        <ManagerButton
          size={ODS_BUTTON_SIZE.sm}
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.stroked}
          onClick={() => {
            navigate(ROUTES_URLS.createKmsServiceKey);
          }}
          urn={okms.iam.urn}
          iamActions={['okms:apiovh:serviceKey/create']}
        >
          <span slot="start">
            <OsdsIcon
              name={ODS_ICON_NAME.ADD}
              size={ODS_ICON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
            ></OsdsIcon>
          </span>

          {t('key_management_service_service-keys_cta_create')}
        </ManagerButton>
      </div>
      <Datagrid
        columns={columns}
        items={okmsServiceKey || []}
        totalItems={0}
        sorting={sorting}
        onSortChange={setSorting}
        contentAlignLeft
      />
      <Outlet />
    </div>
  );
}
