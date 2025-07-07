import React from 'react';
import {
  Outlet,
  useNavigate,
  useParams,
  useOutletContext,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import {
  ODS_MESSAGE_COLOR,
  ODS_BUTTON_SIZE,
  ODS_TEXT_PRESET,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  ErrorBanner,
  ManagerButton,
  useDatagridSearchParams,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  DatagridCellType,
  DatagridCreationDate,
  DatagridServiceKeyActionMenu,
  DatagridServiceKeyCellId,
  DatagridServiceKeyCellName,
  DatagridStatus,
} from '@/components/Listing/ListingCells';
import { useOkmsServiceKeys } from '@/data/hooks/useOkmsServiceKeys';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import Loading from '@/components/Loading/Loading';
import { getOkmsServiceKeyResourceListQueryKey } from '@/data/api/okmsServiceKey';
import { kmsIamActions } from '@/utils/iam/iam.constants';
import { SERVICE_KEY_LIST_TEST_IDS } from './ServiceKeyList.constants';
import { KmsDashboardOutletContext } from '@/pages/dashboard/KmsDashboard.type';
import { OkmsServiceKey } from '@/types/okmsServiceKey.type';

export default function Keys() {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { t: tError } = useTranslation('error');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { sorting, setSorting } = useDatagridSearchParams();
  const { okmsId } = useParams() as { okmsId: string };
  const { error, data: okmsServiceKey, isLoading } = useOkmsServiceKeys({
    sorting,
    okmsId,
  });
  const { okms } = useOutletContext<KmsDashboardOutletContext>();

  if (isLoading) return <Loading />;

  if (error)
    return (
      <ErrorBanner
        error={error}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
          })
        }
      />
    );

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
      cell: (serviceKey: OkmsServiceKey) =>
        DatagridServiceKeyActionMenu(serviceKey, okms),
      isSortable: false,
      label: '',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('key_management_service_service-keys_headline')}
      </OdsText>
      {error && (
        <OdsMessage className="mt-4" color={ODS_MESSAGE_COLOR.critical}>
          {tError('manager_error_page_default')}
        </OdsMessage>
      )}
      <ManagerButton
        id="createEncryptionKey"
        data-testid={SERVICE_KEY_LIST_TEST_IDS.ctaCreateKey}
        size={ODS_BUTTON_SIZE.sm}
        color={ODS_BUTTON_COLOR.primary}
        className="w-fit"
        onClick={() => {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['create_encryption_key'],
          });
          navigate(KMS_ROUTES_URLS.serviceKeyCreate(okmsId));
        }}
        urn={okms.iam.urn}
        iamActions={[kmsIamActions.serviceKeyCreate]}
        label={t('key_management_service_service-keys_cta_create')}
      />
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
