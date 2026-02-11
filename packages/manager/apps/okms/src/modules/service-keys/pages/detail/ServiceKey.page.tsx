import { Suspense } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { TileValueDate } from '@key-management-service/components/dashboard/tile-value-date/tileValueDate.component';
import { ServiceKeyStatus } from '@key-management-service/components/service-key/service-key-status-badge/ServiceKeyStatusBadge.component';
import { okmsQueryKeys } from '@key-management-service/data/api/okms';
import { getOkmsServiceKeyResourceQueryKey } from '@key-management-service/data/api/okmsServiceKey';
import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { useOkmsServiceKeyById } from '@key-management-service/data/hooks/useOkmsServiceKeys';
import { CryptoPropertiesTile } from '@key-management-service/pages/service-key/dashboard/CryptoPropertiesTile.component';
import { useQueryClient } from '@tanstack/react-query';

import { Icon, Link, Text } from '@ovhcloud/ods-react';

import { Error, GridLayout, Notifications } from '@ovh-ux/muk';
import { Clipboard } from '@ovh-ux/muk';
import { Tile } from '@ovh-ux/muk';

import Loading from '@/common/components/loading/Loading';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { URN_LABEL } from '@/constants';

import { OkmsDomainTopZone } from '../../components/domain-top-zone/OkmsDomainTopZone.component';
import { SERVICE_KEYS_ROUTES_URLS } from '../../routes/routes.constants';

export default function ServiceKeyDashboardPage() {
  const { okmsId, keyId } = useRequiredParams('okmsId', 'keyId');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: okms, isPending: isLoadingOkms, error: okmsError } = useOkmsById(okmsId);

  const {
    data: serviceKey,
    error: serviceKeyError,
    isPending: isLoadingServiceKey,
  } = useOkmsServiceKeyById({
    okmsId,
    keyId,
  });

  if (isLoadingServiceKey || isLoadingOkms) {
    return <Loading />;
  }

  if (okmsError) {
    return (
      <Error
        error={okmsError.response}
        onRedirectHome={() => navigate(SERVICE_KEYS_ROUTES_URLS.root)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: okmsQueryKeys.detail(okmsId),
          })
        }
      />
    );
  }

  if (serviceKeyError) {
    return (
      <Error
        error={serviceKeyError.response}
        onRedirectHome={() => navigate(SERVICE_KEYS_ROUTES_URLS.root)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
          })
        }
      />
    );
  }

  if (!okms || !serviceKey) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="px-4 py-8 md:mt-2 md:px-10 md:py-9">
        <OkmsDomainTopZone />
        {/* <div>
          <Breadcrumb>
            <Text
              onClick={() => navigate(SERVICE_KEYS_ROUTES_URLS.serviceKeyList(okmsId))}
              className="cursor-pointer"
            >
              Service Keys
            </Text>
            <Text>{serviceKey.name || serviceKey.id}</Text>
          </Breadcrumb>
        </div> */}
        <header className="my-[24px] flex items-start justify-between">
          <Text preset="heading-1">{serviceKey.name || serviceKey.id}</Text>
        </header>
        <div className="mb-[16px]">
          <Link
            data-testid="manager-back-link"
            onClick={() => {
              navigate(SERVICE_KEYS_ROUTES_URLS.serviceKeyList(okmsId));
            }}
            target="_self"
          >
            <Icon name="arrow-left" />
            Back to the list of Service Keys
          </Link>
        </div>
        <div className="mb-5 max-w-[800px]">
          <Notifications />
        </div>
        <div className="flex flex-col gap-6">
          <GridLayout>
            <Tile.Root title="General information">
              <Tile.Item.Root>
                <Tile.Item.Term label="Display name" />
                <Tile.Item.Description>
                  <Text className="max-w-1/2 overflow-hidden text-ellipsis" preset="paragraph">
                    {serviceKey.name}
                  </Text>
                </Tile.Item.Description>
              </Tile.Item.Root>
              <Tile.Item.Root>
                <Tile.Item.Term label="Service Key ID" />
                <Tile.Item.Description>
                  <Clipboard className="w-full" value={serviceKey.id} />
                </Tile.Item.Description>
              </Tile.Item.Root>
              <Tile.Item.Root>
                <Tile.Item.Term label={URN_LABEL} />
                <Tile.Item.Description>
                  <Clipboard className="w-full" value={serviceKey.iam.urn} />
                </Tile.Item.Description>
              </Tile.Item.Root>
              <Tile.Item.Root>
                <Tile.Item.Term label="Status" />
                <Tile.Item.Description>
                  <ServiceKeyStatus state={serviceKey.state} />
                </Tile.Item.Description>
              </Tile.Item.Root>
              <Tile.Item.Root>
                <Tile.Item.Term label="Creation" />
                <Tile.Item.Description divider={false}>
                  <TileValueDate
                    value={serviceKey.createdAt}
                    options={{
                      hour12: false,
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                    }}
                  />
                </Tile.Item.Description>
              </Tile.Item.Root>
            </Tile.Root>
            <CryptoPropertiesTile serviceKey={serviceKey} />
          </GridLayout>
        </div>
        <Outlet />
      </div>
    </Suspense>
  );
}
