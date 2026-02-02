import React, { Suspense, useEffect, useState } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import Breadcrumb from '@key-management-service/components/breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@key-management-service/components/guide/KmsGuidesHeader';
import { KmsChangelogButton } from '@key-management-service/components/kms-changelog-button/KmsChangelogButton.component';
import { useCreateOkmsServiceKey } from '@key-management-service/data/hooks/useCreateOkmsServiceKey';
import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { useOkmsServiceKeyReference } from '@key-management-service/data/hooks/useOkmsReferenceServiceKey';
import { BreadcrumbItem } from '@key-management-service/hooks/breadcrumb/useBreadcrumb';
import { KMS_ROUTES_URIS, KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import {
  OkmsKeyTypes,
  OkmsServiceKeyCurve,
  OkmsServiceKeyOperations,
  OkmsServiceKeySize,
} from '@key-management-service/types/okmsServiceKey.type';
import { OkmsServiceKeyReference } from '@key-management-service/types/okmsServiceKeyReference.type';
import { ServiceKeyNameErrors } from '@key-management-service/utils/service-key/validateServiceKeyName';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { BaseLayout, ErrorBanner, Notifications } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, PageType } from '@ovh-ux/manager-react-shell-client';

import Loading from '@/common/components/loading/Loading';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { SERVICE_KEYS_LABEL } from '@/constants';

import { CREATE_KEY_TEST_IDS } from './CreateKey.constants';
import { GeneralInformationSection } from './GeneralInformationSection.component';
import { KeyTypeSection } from './KeyTypeSection.component';
import { KeyUsageSection } from './KeyUsageSection.component';
import { ProtectionLevelSection } from './ProtectionLevelSection.component';

export default function CreateKey() {
  const { okmsId } = useRequiredParams('okmsId');
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/serviceKeys');

  const {
    data: okms,
    isLoading: okmsIsLoading,
    error: okmsError,
    refetch: refetchOkms,
  } = useOkmsById(okmsId);

  const {
    data: servicekeyReference,
    isLoading: serviceKeyReferenceIsLoading,
    error: serviceKeyReferenceError,
    refetch: refetchServiceKeyReference,
  } = useOkmsServiceKeyReference(okms?.region || '');

  const [key, setKey] = React.useState<OkmsServiceKeyReference | undefined>();
  const [keyType, setKeyType] = React.useState<OkmsKeyTypes | undefined>();
  const [keySize, setKeySize] = React.useState<OkmsServiceKeySize | undefined>();
  const [keyCurve, setKeyCurve] = React.useState<OkmsServiceKeyCurve | undefined>();
  const [keyOperations, setKeyOperations] = useState<OkmsServiceKeyOperations[][]>([[]]);
  const [keyDisplayName, setKeyDisplayName] = React.useState<string | undefined>();
  const [serviceKeyNameError, setServiceKeyNameError] = useState<
    ServiceKeyNameErrors | undefined
  >();
  const { trackClick, trackPage } = useOkmsTracking();
  const { createKmsServiceKey, isPending } = useCreateOkmsServiceKey({
    okmsId,
  });

  // Set default key reference if available
  useEffect(() => {
    if (!serviceKeyReferenceIsLoading && !key) {
      servicekeyReference?.forEach((reference) => {
        if (reference.default) {
          setKey(reference);
          setKeyType(reference.type);
          setKeySize(reference.sizes.find((size) => size.default)?.value || undefined);
          setKeyCurve(reference.curves.find((curve) => curve.default)?.value || undefined);
        }
      });
    }
  }, [servicekeyReference, serviceKeyReferenceIsLoading, key]);

  // Submit form
  const handleSubmit = async () => {
    if (!keyDisplayName || !keyType) {
      return;
    }

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['confirm'],
    });

    try {
      await createKmsServiceKey({
        name: keyDisplayName,
        context: keyDisplayName,
        curve: keyCurve,
        size: keySize ? (Number(keySize) as OkmsServiceKeySize) : undefined,
        operations: keyOperations.flat(),
        type: keyType,
      });

      navigate(KMS_ROUTES_URLS.serviceKeyListing(okmsId));
      trackPage({
        pageType: PageType.bannerSuccess,
        pageTags: ['create', 'service-key'],
      });
    } catch {
      trackPage({
        pageType: PageType.bannerError,
        pageTags: ['create', 'service-key'],
      });
    }
  };

  const breadcrumbItems: BreadcrumbItem[] = [
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

  if (okmsIsLoading || serviceKeyReferenceIsLoading) {
    return <Loading />;
  }

  if (okmsError) {
    return (
      <ErrorBanner
        error={okmsError.response}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
        onReloadPage={refetchOkms}
      />
    );
  }

  if (serviceKeyReferenceError) {
    return (
      <ErrorBanner
        error={serviceKeyReferenceError.response}
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
          description: t('key_management_service_service-keys_create_subtitle'),
          headerButton: <KmsGuidesHeader />,
          changelogButton: <KmsChangelogButton />,
        }}
        message={<Notifications />}
      >
        <div className="block w-full">
          <div className="max-w-lg gap-4 lg:gap-6">
            <div className="flex flex-col gap-4 md:gap-8">
              <ProtectionLevelSection />
              <GeneralInformationSection
                keyDisplayName={keyDisplayName}
                setKeyDisplayName={setKeyDisplayName}
                serviceKeyNameError={serviceKeyNameError}
                setServiceKeyNameError={setServiceKeyNameError}
              />
              <KeyTypeSection
                serviceKey={key}
                keyCurve={keyCurve}
                keySize={keySize}
                keyType={keyType}
                region={okms?.region || ''}
                setServiceKey={setKey}
                setKeyCurve={setKeyCurve}
                setKeySize={setKeySize}
                setKeyType={setKeyType}
              />
              <KeyUsageSection
                serviceKey={key}
                keyOperations={keyOperations}
                setKeyOperations={setKeyOperations}
                keyType={keyType}
              />
              <div className="flex gap-4">
                <OdsButton
                  size={ODS_BUTTON_SIZE.md}
                  variant={ODS_BUTTON_VARIANT.outline}
                  color={ODS_BUTTON_COLOR.primary}
                  onClick={() => {
                    trackClick({
                      location: PageLocation.funnel,
                      buttonType: ButtonType.button,
                      actionType: 'action',
                      actions: ['cancel'],
                    });
                    navigate(KMS_ROUTES_URLS.serviceKeyListing(okmsId));
                  }}
                  label={t('key_management_service_service-keys_create_cta_cancel')}
                />
                <OdsButton
                  size={ODS_BUTTON_SIZE.md}
                  color={ODS_BUTTON_COLOR.primary}
                  data-testid={CREATE_KEY_TEST_IDS.ctaConfirm}
                  onClick={handleSubmit}
                  isLoading={isPending}
                  isDisabled={
                    !keyDisplayName || !!serviceKeyNameError || keyOperations?.length === 0
                  }
                  label={t('key_management_service_service-keys_create_cta_submit')}
                />
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </BaseLayout>
    </Suspense>
  );
}
