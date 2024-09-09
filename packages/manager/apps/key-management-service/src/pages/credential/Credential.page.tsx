import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsTabsChangeEventDetail,
  OsdsTabsCustomEvent,
} from '@ovhcloud/ods-components';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { BaseLayout, ErrorBanner } from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import {
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
} from '@ovhcloud/ods-components/react';
import {
  getOkmsCredentialQueryKey,
  useOkmsCredentialById,
} from '@/data/hooks/useOkmsCredential';
import Loading from '@/components/Loading/Loading';
import { ROUTES_URLS } from '@/routes/routes.constants';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { useOKMSById } from '@/data/hooks/useOKMS';

const CredentialDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/credential');
  const [activePanel, setActivePanel] = useState('');
  const location = useLocation();
  const { okmsId, credentialId } = useParams();

  const { data: okms, isLoading: isLoadingKms, error: errorKms } = useOKMSById(
    okmsId,
  );

  const {
    data,
    isLoading: isLoadingCredential,
    error: errorCredential,
  } = useOkmsCredentialById({
    okmsId,
    credentialId,
  });

  useEffect(() => {
    setActivePanel(location.pathname);
  }, [location]);

  const handleTabChange = (
    event: OsdsTabsCustomEvent<OdsTabsChangeEventDetail>,
  ) => {
    const {
      detail: { panel },
    } = event;
    setActivePanel(panel);
    navigate(panel);
  };

  if (isLoadingCredential || isLoadingKms) return <Loading />;

  if (errorCredential || errorKms) {
    return (
      <ErrorBanner
        error={errorKms?.response || errorCredential?.response}
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsCredentialQueryKey({ okmsId, credentialId }),
          })
        }
      />
    );
  }

  const credential = data.data;

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: okmsId,
      label: okms.data.iam.displayName,
      navigateTo: `/${okmsId}`,
    },
    {
      id: ROUTES_URLS.credentials,
      label: t('key_management_service_credential'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}`,
    },
    {
      id: credentialId,
      label: credential.name,
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}/${credentialId}`,
    },
    {
      id: ROUTES_URLS.credentialIdentities,
      label: t('key_management_service_credential_identities'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}/${credentialId}/${ROUTES_URLS.credentialIdentities}`,
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <BaseLayout
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        header={{
          title: credential.name || credential.id,
          headerButton: <KmsGuidesHeader />,
        }}
        backLinkLabel={t(
          'key_management_service_credential_dashboard_backlink',
        )}
        onClickReturn={() => navigate(`/${okmsId}/${ROUTES_URLS.credentials}`)}
        tabs={
          <OsdsTabs
            panel={activePanel}
            onOdsTabsChanged={(event) => handleTabChange(event)}
          >
            <OsdsTabBar slot="top">
              <OsdsTabBarItem
                panel={`/${okmsId}/${ROUTES_URLS.credentials}/${credentialId}`}
                role="tab"
              >
                {t(
                  'key_management_service_credential_dashboard_tab_informations',
                )}
              </OsdsTabBarItem>
              <OsdsTabBarItem
                panel={`/${okmsId}/${ROUTES_URLS.credentials}/${credentialId}/${ROUTES_URLS.credentialIdentities}`}
                role="tab"
              >
                {t(
                  'key_management_service_credential_dashboard_tab_identities',
                )}
              </OsdsTabBarItem>
            </OsdsTabBar>
          </OsdsTabs>
        }
      >
        <Outlet context={credential} />
      </BaseLayout>
    </Suspense>
  );
};

export default CredentialDashboard;
