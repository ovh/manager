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
  OkmsServiceKeyTypeECCurve,
  OkmsServiceKeyTypeOctSize,
  OkmsServiceKeyTypeRSASize,
} from '@/types/okmsServiceKey.type';
import { ServiceKeyNameErrorsType } from '@/utils/serviceKey/validateServiceKeyName';
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

export default function CreateKey() {
  const { okmsId } = useParams();
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
  } = useOkmsServiceKeyReference(okms?.data?.region);

  const [key, setKey] = useState<OkmsServiceKeyReference>();
  const [keyType, setKeyType] = useState<OkmsKeyTypes>();
  const [keySize, setKeySize] = useState<
    OkmsServiceKeyTypeOctSize | OkmsServiceKeyTypeRSASize
  >();
  const [keyCurve, setKeyCurve] = useState<OkmsServiceKeyTypeECCurve>();
  const [keyOperations, setKeyOperations] = useState<
    OkmsServiceKeyOperations[][]
  >();
  const [keyDisplayName, setKeyDisplayName] = useState<string>(null);
  const [serviceKeyNameError, setServiceKeyNameError] = useState<
    ServiceKeyNameErrorsType
  >(null);
  const { trackClick, trackPage } = useOvhTracking();
  const { createKmsServiceKey, isPending } = useCreateOkmsServiceKey({
    okmsId,
    onSuccess: () => {
      navigate(`/${KMS_ROUTES_URIS.root}/${okmsId}/${KMS_ROUTES_URIS.keys}`);
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'create_encryption_key',
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'create_encryption_key',
      });
    },
  });

  useEffect(() => {
    if (okms && !okmsIsLoading && !servicekeyReference) {
      refetchServiceKeyReference();
    }
  }, [okms, okmsIsLoading, refetchServiceKeyReference, servicekeyReference]);

  useEffect(() => {
    if (!serviceKeyReferenceIsLoading && !key) {
      servicekeyReference?.data?.forEach((reference) => {
        if (reference.default) {
          setKey(reference);
          setKeyType(reference.type);
          setKeySize(
            reference.sizes.find((size) => size.default)?.value || null,
          );
          setKeyCurve(
            reference.curves.find((curve) => curve.default)?.value || null,
          );
        }
      });
    }
  }, [servicekeyReference, serviceKeyReferenceIsLoading]);

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: KMS_ROUTES_URIS.root,
      label: t(
        'key-management-service/listing:key_management_service_listing_title',
      ),
      navigateTo: `/${KMS_ROUTES_URIS.root}`,
    },
    {
      id: okmsId,
      label: okms?.data?.iam?.displayName,
      navigateTo: `/${okmsId}`,
    },
    {
      id: KMS_ROUTES_URIS.keys,
      label: SERVICE_KEYS_LABEL,
      navigateTo: `/${okmsId}/${KMS_ROUTES_URIS.keys}`,
    },
    {
      id: KMS_ROUTES_URIS.createKmsServiceKey,
      label: t('key_management_service_service-keys_create_title'),
      navigateTo: `/${okmsId}/${KMS_ROUTES_URIS.keys}/${KMS_ROUTES_URIS.createKmsServiceKey}`,
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
        }}
        message={<Notifications />}
      >
        <div className="w-full block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="flex flex-col gap-7 md:gap-9">
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
                region={okms?.data?.region}
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
                    navigate(
                      `/${KMS_ROUTES_URIS.root}/${okmsId}/${KMS_ROUTES_URIS.keys}`,
                    );
                  }}
                  label={t(
                    'key_management_service_service-keys_create_cta_cancel',
                  )}
                />
                <OdsButton
                  size={ODS_BUTTON_SIZE.md}
                  color={ODS_BUTTON_COLOR.primary}
                  data-testid={CREATE_KEY_TEST_IDS.ctaConfirm}
                  onClick={() => {
                    trackClick({
                      location: PageLocation.funnel,
                      buttonType: ButtonType.button,
                      actionType: 'action',
                      actions: ['confirm'],
                    });
                    createKmsServiceKey({
                      name: keyDisplayName,
                      context: keyDisplayName,
                      curve: keyCurve,
                      size: keySize
                        ? (Number(keySize) as
                            | OkmsServiceKeyTypeOctSize
                            | OkmsServiceKeyTypeRSASize)
                        : null,
                      operations: keyOperations.flat(),
                      type: keyType,
                    });
                  }}
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
