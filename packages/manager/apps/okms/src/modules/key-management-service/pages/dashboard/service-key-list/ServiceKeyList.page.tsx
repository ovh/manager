import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';

import {
  DatagridCellType,
  DatagridCreationDate,
  DatagridServiceKeyActionMenu,
  DatagridServiceKeyCellId,
  DatagridServiceKeyCellName,
  DatagridStatus,
} from '@key-management-service/components/listing/ListingCells';
import { getOkmsServiceKeyResourceListQueryKey } from '@key-management-service/data/api/okmsServiceKey';
import { useOkmsServiceKeys } from '@key-management-service/data/hooks/useOkmsServiceKeys';
import { KmsDashboardOutletContext } from '@key-management-service/pages/dashboard/KmsDashboard.type';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import { Message } from '@ovhcloud/ods-react';
import { Text } from '@ovhcloud/ods-react';

import { Datagrid } from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Button, Error } from '@ovh-ux/muk';

import Loading from '@/common/components/loading/Loading';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';

import { SERVICE_KEY_LIST_TEST_IDS } from './ServiceKeyList.constants';

export default function Keys() {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { t: tError } = useTranslation('error');
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();

  const { okmsId } = useRequiredParams('okmsId');
  const { error, data: okmsServiceKey, isLoading } = useOkmsServiceKeys({ okmsId });
  const { okms } = useOutletContext<KmsDashboardOutletContext>();

  if (isLoading) return <Loading />;

  if (error)
    return (
      <Error
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
      cell: (serviceKey: OkmsServiceKey) => DatagridServiceKeyActionMenu(serviceKey, okms),
      isSortable: false,
      label: '',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Text preset="paragraph">{t('key_management_service_service-keys_headline')}</Text>
      {error && (
        <Message className="mt-4" color="critical">
          {tError('manager_error_page_default')}
        </Message>
      )}
      <Button
        id="createEncryptionKey"
        data-testid={SERVICE_KEY_LIST_TEST_IDS.ctaCreateKey}
        color="primary"
        className="w-fit"
        onClick={() => {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['create', 'service-key'],
          });
          navigate(KMS_ROUTES_URLS.serviceKeyCreate(okmsId));
        }}
        urn={okms.iam.urn}
        iamActions={[kmsIamActions.serviceKeyCreate]}
      >
        {t('key_management_service_service-keys_cta_create')}
      </Button>
      <Datagrid columns={columns} items={okmsServiceKey || []} totalItems={0} contentAlignLeft />
      <Outlet />
    </div>
  );
}
