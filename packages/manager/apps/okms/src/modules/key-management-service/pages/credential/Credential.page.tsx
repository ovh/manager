import { Suspense } from 'react';

import { NavLink, Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';

import Breadcrumb from '@key-management-service/components/breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@key-management-service/components/guide/KmsGuidesHeader';
import { KmsChangelogButton } from '@key-management-service/components/kms-changelog-button/KmsChangelogButton.component';
import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import {
  getOkmsCredentialQueryKey,
  useOkmsCredentialById,
} from '@key-management-service/data/hooks/useOkmsCredential';
import { BreadcrumbItem } from '@key-management-service/hooks/breadcrumb/useBreadcrumb';
import { KMS_ROUTES_URIS, KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsCredential } from '@key-management-service/types/okmsCredential.type';
import { useTranslation } from 'react-i18next';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { BaseLayout, ErrorBanner, Notifications } from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import Loading from '@/common/components/loading/Loading';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

export type CredentialContextType = {
  okms: OKMS;
  credential: OkmsCredential;
};

export function useOutletCredential() {
  return useOutletContext<CredentialContextType>();
}

const CredentialDashboard = () => {
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/credential');
  const location = useLocation();
  const { okmsId, credentialId } = useRequiredParams('okmsId', 'credentialId');

  const { data: okms, isPending: isLoadingKms, error: errorKms } = useOkmsById(okmsId);

  const {
    data,
    isPending: isLoadingCredential,
    error: errorCredential,
  } = useOkmsCredentialById({
    okmsId,
    credentialId,
  });

  if (isLoadingCredential || isLoadingKms) return <Loading />;

  if (errorCredential || errorKms) {
    return (
      <ErrorBanner
        error={errorCredential?.response || errorKms?.response || {}}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
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
      navigateTo: KMS_ROUTES_URLS.kmsDashboard(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.credentials,
      label: t('key_management_service_credential'),
      navigateTo: KMS_ROUTES_URLS.credentialListing(okmsId),
    },
    {
      id: credentialId,
      label: credential.name,
      navigateTo: KMS_ROUTES_URLS.credentialDashboard(okmsId, credentialId),
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <BaseLayout
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        header={{
          title: credential.name || credential.id,
          headerButton: <KmsGuidesHeader />,
          changelogButton: <KmsChangelogButton />,
        }}
        backLinkLabel={t('key_management_service_credential_dashboard_backlink')}
        message={<Notifications />}
        onClickReturn={() => {
          navigate(KMS_ROUTES_URLS.credentialListing(okmsId));
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['return_listing_page'],
          });
        }}
        tabs={
          <OdsTabs>
            <OdsTab
              isSelected={
                location.pathname === KMS_ROUTES_URLS.credentialDashboard(okmsId, credentialId)
              }
            >
              <NavLink
                to={KMS_ROUTES_URLS.credentialDashboard(okmsId, credentialId)}
                className="flex no-underline"
                onClick={() => {
                  trackClick({
                    location: PageLocation.page,
                    buttonType: ButtonType.tab,
                    actionType: 'navigation',
                    actions: ['general-informations'],
                  });
                }}
              >
                {t('key_management_service_credential_dashboard_tab_informations')}
              </NavLink>
            </OdsTab>
            <OdsTab
              isSelected={
                location.pathname === KMS_ROUTES_URLS.credentialIdentitiesList(okmsId, credentialId)
              }
            >
              <NavLink
                to={KMS_ROUTES_URLS.credentialIdentitiesList(okmsId, credentialId)}
                className="flex no-underline"
                onClick={() => {
                  trackClick({
                    location: PageLocation.page,
                    buttonType: ButtonType.tab,
                    actionType: 'navigation',
                    actions: ['identities'],
                  });
                }}
              >
                {t('key_management_service_credential_dashboard_tab_identities')}
              </NavLink>
            </OdsTab>
          </OdsTabs>
        }
      >
        <Outlet context={{ credential, okms: okms.data } as CredentialContextType} />
      </BaseLayout>
    </Suspense>
  );
};

export default CredentialDashboard;
