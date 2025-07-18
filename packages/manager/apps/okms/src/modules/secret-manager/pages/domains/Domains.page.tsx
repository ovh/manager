import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseLayout, ErrorBanner } from '@ovh-ux/manager-react-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { filterDomainsByRegion } from '@secret-manager/utils/domains';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { OkmsDatagrid } from '@/common/components/okmsDatagrid/OkmsDatagrid.component';
import { useOkmsDatagridList } from '@/data/hooks/useOkms';
import { isErrorResponse } from '@/utils/api/api';

export default function SecretDomainsPage() {
  const { t } = useTranslation([
    'secret-manager/domains',
    'key-management-service/create',
  ]);
  const navigate = useNavigate();
  const { region } = useParams() as { region: string };

  const { data, error, isPending, refetch } = useOkmsDatagridList({
    pageSize: 100,
  });
  const flattenData = data?.pages.flatMap((page) => page.data);

  // Filter okms by regionId
  const okmsList = flattenData
    ? filterDomainsByRegion(flattenData, region)
    : [];

  // Redirect to secret root if no okms found for the region
  // This handles the case where the region is not valid or no okms are available
  useEffect(() => {
    if (!isPending && okmsList.length === 0) {
      navigate({
        pathname: SECRET_MANAGER_ROUTES_URLS.secretManagerRoot,
      });
    }
  }, [isPending, okmsList.length, flattenData]);

  if (error) {
    return (
      <ErrorBanner
        error={isErrorResponse(error) ? error.response : {}}
        onRedirectHome={() =>
          navigate(SECRET_MANAGER_ROUTES_URLS.secretManagerOnboarding)
        }
        onReloadPage={refetch}
      />
    );
  }

  return (
    <BaseLayout header={{ title: t('secret-manager/domains:domains_list') }}>
      <OkmsDatagrid
        type="secret-manager"
        isLoading={isPending}
        okmsList={okmsList}
        topbar={
          <OdsButton
            label={t(
              'key-management-service/create:key_management_service_create_title',
            )}
            onClick={() => {
              navigate(KMS_ROUTES_URLS.kmsCreate);
            }}
          />
        }
      />
    </BaseLayout>
  );
}
