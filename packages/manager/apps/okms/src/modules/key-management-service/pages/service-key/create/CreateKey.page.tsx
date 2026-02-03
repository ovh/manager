import { Suspense } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import Breadcrumb from '@key-management-service/components/breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@key-management-service/components/guide/KmsGuidesHeader';
import { KmsChangelogButton } from '@key-management-service/components/kms-changelog-button/KmsChangelogButton.component';
import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { useOkmsServiceKeyReference } from '@key-management-service/data/hooks/useOkmsReferenceServiceKey';
import { KmsBreadcrumbItem } from '@key-management-service/hooks/breadcrumb/useBreadcrumb';
import { KMS_ROUTES_URIS, KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { BaseLayout, Error, Notifications } from '@ovh-ux/muk';

import Loading from '@/common/components/loading/Loading';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { SERVICE_KEYS_LABEL } from '@/constants';

import { CreateKeyForm } from './components/CreateKeyForm.component';

export default function CreateKey() {
  const { okmsId } = useRequiredParams('okmsId');
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/serviceKeys');

  const {
    data: okms,
    isPending: okmsIsPending,
    error: okmsError,
    refetch: refetchOkms,
  } = useOkmsById(okmsId);

  const {
    data: servicekeyReference,
    isPending: serviceKeyReferenceIsPending,
    error: serviceKeyReferenceError,
    refetch: refetchServiceKeyReference,
  } = useOkmsServiceKeyReference(okms?.region || '');

  const breadcrumbItems: KmsBreadcrumbItem[] = [
    {
      id: okmsId,
      label: okms?.iam?.displayName || okmsId,
      navigateTo: KMS_ROUTES_URLS.kmsDashboard(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.serviceKeys,
      label: SERVICE_KEYS_LABEL,
      navigateTo: KMS_ROUTES_URLS.serviceKeyListing(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.serviceKeyCreate,
      label: t('key_management_service_service-keys_create_title'),
      navigateTo: KMS_ROUTES_URLS.serviceKeyCreate(okmsId),
    },
  ];

  if (okmsIsPending || serviceKeyReferenceIsPending) {
    return <Loading />;
  }

  if (okmsError) {
    return (
      <Error
        error={okmsError.response}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
        onReloadPage={refetchOkms}
      />
    );
  }

  if (serviceKeyReferenceError) {
    return (
      <Error
        error={serviceKeyReferenceError.response}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
        onReloadPage={refetchServiceKeyReference}
      />
    );
  }

  const defaultReference = servicekeyReference.find((ref) => ref.default);
  if (!defaultReference) {
    return (
      <Error
        error={{
          data: {
            message: 'No default reference found',
          },
        }}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
        onReloadPage={refetchServiceKeyReference}
      />
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <BaseLayout
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        header={{
          title: t('key_management_service_service-keys_create_title'),
          guideMenu: <KmsGuidesHeader />,
          changelogButton: <KmsChangelogButton />,
        }}
        description={t('key_management_service_service-keys_create_subtitle')}
        message={<Notifications />}
      >
        <CreateKeyForm
          okmsId={okmsId}
          region={okms.region}
          references={servicekeyReference}
          defaultReference={defaultReference}
        />
        <Outlet />
      </BaseLayout>
    </Suspense>
  );
}
