import { Outlet, useNavigate } from 'react-router-dom';

import {
  DatagridCellType,
  DatagridCreationDate,
  DatagridServiceKeyCellId,
  DatagridServiceKeyCellName,
  DatagridStatus,
} from '@key-management-service/components/listing/ListingCells';
import { getOkmsServiceKeyResourceListQueryKey } from '@key-management-service/data/api/okmsServiceKey';
import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { useOkmsServiceKeys } from '@key-management-service/data/hooks/useOkmsServiceKeys';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import { Breadcrumb, Text } from '@ovhcloud/ods-react';

import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { Error, Notifications } from '@ovh-ux/muk';
import { useNotifications } from '@ovh-ux/muk';

import Loading from '@/common/components/loading/Loading';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { OkmsDomainTopZone } from '../../components/domain-top-zone/OkmsDomainTopZone.component';
import { SERVICE_KEYS_ROUTES_URLS } from '../../routes/routes.constants';

export default function ServiceKeyListPage() {
  const { t } = useTranslation(['service-keys']);
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const { okmsId } = useRequiredParams('okmsId');

  const { isPending: isOkmsPending, error: okmsError } = useOkmsById(okmsId);
  const {
    data: okmsServiceKeys,
    isLoading: isServiceKeysPending,
    error: serviceKeysError,
  } = useOkmsServiceKeys({ okmsId });

  if (isOkmsPending || isServiceKeysPending) {
    return <Loading />;
  }

  if (okmsError) {
    return (
      <Error
        error={okmsError.response}
        onRedirectHome={() => navigate(SERVICE_KEYS_ROUTES_URLS.root)}
        onReloadPage={() => {
          void queryClient.refetchQueries({
            queryKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
          });
        }}
      />
    );
  }

  if (serviceKeysError) {
    return (
      <Error
        error={{
          data: { message: serviceKeysError.response?.data.message ?? 'error' },
        }}
        onRedirectHome={() => navigate(SERVICE_KEYS_ROUTES_URLS.root)}
        onReloadPage={() => {
          void queryClient.refetchQueries({
            queryKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
          });
        }}
      />
    );
  }

  const columns: DatagridColumn<OkmsServiceKey>[] = [
    {
      id: 'name',
      cell: DatagridServiceKeyCellName,
      label: t(
        'key-management-service/serviceKeys:key_management_service_service-keys_column_name',
      ),
    },
    {
      id: 'id',
      cell: DatagridServiceKeyCellId,
      label: t('key-management-service/serviceKeys:key_management_service_service-keys_column_id'),
    },
    {
      id: 'type',
      cell: DatagridCellType,
      label: t(
        'key-management-service/serviceKeys:key_management_service_service-keys_column_type',
      ),
    },
    {
      id: 'creation_date',
      cell: DatagridCreationDate,
      label: t(
        'key-management-service/serviceKeys:key_management_service_service-keys_column_created-at',
      ),
    },
    {
      id: 'status',
      cell: DatagridStatus,
      label: t(
        'key-management-service/serviceKeys:key_management_service_service-keys_column_state',
      ),
    },
  ];

  return (
    <div className="px-4 py-8 md:mt-2 md:px-10 md:py-9">
      <OkmsDomainTopZone />
      <div>
        <Breadcrumb>
          <Text>{t('service-keys:service_keys')}</Text>
        </Breadcrumb>
      </div>
      <header className="my-[24px] flex items-start justify-between">
        <Text preset="heading-1">{t('service-keys:service_keys')}</Text>
      </header>
      {notifications.length > 0 && (
        <div className="mb-5 max-w-[800px]">
          <Notifications />
        </div>
      )}
      <div className="flex flex-col gap-6">
        <Text preset="paragraph">{t('service-keys:service_keys_headline')}</Text>
        <Datagrid
          columns={columns}
          items={okmsServiceKeys || []}
          totalItems={okmsServiceKeys?.length ?? 0}
          contentAlignLeft
        />
      </div>
      <Outlet />
    </div>
  );
}
