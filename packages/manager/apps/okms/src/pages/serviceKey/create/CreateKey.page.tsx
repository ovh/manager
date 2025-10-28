import React, { Suspense, useEffect, useState } from 'react';
import {
  BaseLayout,
  ErrorBanner,
  Notifications,
} from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { KMS_ROUTES_URIS, KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { OkmsServiceKeyReference } from '@/types/okmsServiceKeyReference.type';
import {
  OkmsKeyTypes,
  OkmsServiceKeyOperations,
  OkmsServiceKeyCurve,
  OkmsServiceKeySize,
} from '@/types/okmsServiceKey.type';
import { ServiceKeyNameErrors } from '@/utils/serviceKey/validateServiceKeyName';
import { useOkmsServiceKeyReference } from '@/data/hooks/useOkmsReferenceServiceKey';
import { useCreateOkmsServiceKey } from '@/data/hooks/useCreateOkmsServiceKey';
import { useOkmsById } from '@/data/hooks/useOkms';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Loading from '@/components/Loading/Loading';
import { ProtectionLevelSection } from './ProtectionLevelSection.component';
import { GeneralInformationSection } from './GeneralInformationSection.component';
import { KeyTypeSection } from './KeyTypeSection.component';
import { KeyUsageSection } from './KeyUsageSection.component';
import { CREATE_KEY_TEST_IDS } from './CreateKey.constants';
import { SERVICE_KEYS_LABEL } from '@/constants';
import { KmsChangelogButton } from '@/components/kmsChangelogButton/KmsChangelogButton.component';

export default function CreateKey() {
  const { okmsId } = useParams() as { okmsId: string };
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
  } = useOkmsServiceKeyReference(okms?.data?.region || '');

  const [key, setKey] = useState<OkmsServiceKeyReference | undefined>();
  const [keyType, setKeyType] = useState<OkmsKeyTypes | undefined>();
  const [keySize, setKeySize] = useState<OkmsServiceKeySize | undefined>();
  const [keyCurve, setKeyCurve] = useState<OkmsServiceKeyCurve | undefined>();
  const [keyOperations, setKeyOperations] = useState<
    OkmsServiceKeyOperations[][]
  >([[]]);
  const [keyDisplayName, setKeyDisplayName] = useState<string | undefined>();
  const [serviceKeyNameError, setServiceKeyNameError] = useState<
    ServiceKeyNameErrors | undefined
  >();
  const { trackClick, trackPage } = useOvhTracking();
  const { createKmsServiceKey, isPending } = useCreateOkmsServiceKey({
    okmsId,
  });

  // Set default key reference if available
  useEffect(() => {
    if (!serviceKeyReferenceIsLoading && !key) {
      servicekeyReference?.data?.forEach((reference) => {
        if (reference.default) {
          setKey(reference);
          setKeyType(reference.type);
          setKeySize(
            reference.sizes.find((size) => size.default)?.value || undefined,
          );
          setKeyCurve(
            reference.curves.find((curve) => curve.default)?.value || undefined,
          );
        }
      });
    }
  }, [servicekeyReference, serviceKeyReferenceIsLoading]);

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
        pageName: 'create_encryption_key',
      });
    } catch (error) {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'create_encryption_key',
      });
    }
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: okmsId,
      label: okms?.data?.iam?.displayName || okmsId,
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
        <div className="w-full block">
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
                region={okms?.data?.region || ''}
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
                  label={t(
                    'key_management_service_service-keys_create_cta_cancel',
                  )}
                />
                <OdsButton
                  size={ODS_BUTTON_SIZE.md}
                  color={ODS_BUTTON_COLOR.primary}
                  data-testid={CREATE_KEY_TEST_IDS.ctaConfirm}
                  onClick={handleSubmit}
                  isLoading={isPending}
                  isDisabled={
                    !keyDisplayName ||
                    !!serviceKeyNameError ||
                    keyOperations?.length === 0
                  }
                  label={t(
                    'key_management_service_service-keys_create_cta_submit',
                  )}
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
