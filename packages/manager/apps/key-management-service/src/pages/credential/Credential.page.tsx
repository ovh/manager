import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { BaseLayout, ErrorBanner } from '@ovhcloud/manager-components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
} from '@ovhcloud/ods-components/react';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';

import Loading from '@/components/Loading/Loading';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { useOKMSById } from '@/data/hooks/useOKMS';
import { useOkmsCredentialById } from '@/data/hooks/useOkmsCredential';
import { getOkmsCredentialQueryKey } from '@/data/api/okmsCredential';

const Credentials = () => {
  const { okmsId, credentialId } = useParams();
  const { data: okms } = useOKMSById(okmsId);
  const { data: credential, error, isLoading } = useOkmsCredentialById({
    okmsId,
    credentialId,
  });
  const { t } = useTranslation('key-management-service/credential');
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const kms = okms?.data;
  const kmsCredential = credential?.data;

  if (isLoading) return <Loading />;

  if (error)
    return (
      <ErrorBanner
        error={error.response}
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsCredentialQueryKey({ okmsId, credentialId }),
          })
        }
      />
    );

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: okmsId,
      label: kms.iam.displayName,
      navigateTo: `/${okmsId}`,
    },
    {
      id: ROUTES_URLS.credentials,
      label: t('key_management_service_credential'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}`,
    },
    {
      id: credentialId,
      label: kmsCredential.name,
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}/${credentialId}`,
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <BaseLayout
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        header={{
          title: kmsCredential.name || kmsCredential.id,
          headerButton: <KmsGuidesHeader />,
        }}
        tabs={
          <OsdsTabs>
            <OsdsTabBar slot="top">
              <OsdsTabBarItem panel="tab1" role="tab">
                {t(
                  'key_management_service_credential_dashboard_tab_informations',
                )}
              </OsdsTabBarItem>
              <OsdsTabBarItem panel="tab2" role="tab">
                {t(
                  'key_management_service_credential_dashboard_tab_identities',
                )}
              </OsdsTabBarItem>
            </OsdsTabBar>
          </OsdsTabs>
        }
      />
      <Outlet />
    </Suspense>
  );
};

export default Credentials;
