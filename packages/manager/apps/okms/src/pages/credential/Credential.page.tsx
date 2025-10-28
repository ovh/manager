import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  BaseLayout,
  ErrorBanner,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { KmsChangelogButton } from '@/components/kmsChangelogButton/KmsChangelogButton.component';
import {
  getOkmsCredentialQueryKey,
  useOkmsCredentialById,
} from '@/data/hooks/useOkmsCredential';
import Loading from '@/components/Loading/Loading';
import { KMS_ROUTES_URIS, KMS_ROUTES_URLS } from '@/routes/routes.constants';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { useOkmsById } from '@/data/hooks/useOkms';
import { OKMS } from '@/types/okms.type';
import { OkmsCredential } from '@/types/okmsCredential.type';

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
  const { okmsId, credentialId } = useParams() as {
    okmsId: string;
    credentialId: string;
  };

  const { data: okms, isPending: isLoadingKms, error: errorKms } = useOkmsById(
    okmsId,
  );

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
        backLinkLabel={t(
          'key_management_service_credential_dashboard_backlink',
        )}
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
                location.pathname ===
                KMS_ROUTES_URLS.credentialDashboard(okmsId, credentialId)
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
                {t(
                  'key_management_service_credential_dashboard_tab_informations',
                )}
              </NavLink>
            </OdsTab>
            <OdsTab
              isSelected={
                location.pathname ===
                KMS_ROUTES_URLS.credentialIdentitiesList(okmsId, credentialId)
              }
            >
              <NavLink
                to={KMS_ROUTES_URLS.credentialIdentitiesList(
                  okmsId,
                  credentialId,
                )}
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
                {t(
                  'key_management_service_credential_dashboard_tab_identities',
                )}
              </NavLink>
            </OdsTab>
          </OdsTabs>
        }
      >
        <Outlet
          context={{ credential, okms: okms.data } as CredentialContextType}
        />
      </BaseLayout>
    </Suspense>
  );
};

export default CredentialDashboard;
