import React, { Suspense, useState } from 'react';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import {
  BaseLayout,
  ErrorBanner,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CreateGeneralInformations from '@key-management-service/pages/credential/create/CreateGeneralInformations.component';
import CreateAddIdentities from '@key-management-service/pages/credential/create/CreateAddIdentities.component';
import CreateCredentialConfirmation from '@key-management-service/pages/credential/create/confirmation/CreateCredentialConfirmation.component';
import Breadcrumb from '@key-management-service/components/Breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@key-management-service/components/Guide/KmsGuidesHeader';
import Loading from '@key-management-service/components/Loading/Loading';
import { KmsChangelogButton } from '@key-management-service/components/kmsChangelogButton/KmsChangelogButton.component';
import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { useCreateOkmsCredential } from '@key-management-service/data/hooks/useCreateOkmsCredential';
import { BreadcrumbItem } from '@key-management-service/hooks/breadcrumb/useBreadcrumb';
import { IdentityDataProvider } from '@key-management-service/hooks/credential/useIdentityData';
import {
  CertificateType,
  OkmsCredential,
} from '@key-management-service/types/okmsCredential.type';
import {
  KMS_ROUTES_URIS,
  KMS_ROUTES_URLS,
} from '@key-management-service/routes/routes.constants';

const CreateCredential = () => {
  const navigate = useNavigate();
  const { trackPage } = useOvhTracking();
  const { okmsId } = useParams() as { okmsId: string };
  const { data: okms, isLoading, error } = useOkmsById(okmsId);
  const { t } = useTranslation('key-management-service/credential');
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string | null>(null);
  const [validity, setValidity] = useState<number>(30);
  const [description, setDescription] = useState<string | null>(null);
  const [csr, setCsr] = useState<string | null>(null);
  const [
    certificateType,
    setCertificateType,
  ] = useState<CertificateType | null>(null);
  const [identityURNs, setIdentityURNs] = useState<string[]>([]);
  const [okmsCredential, setOkmsCredential] = useState<OkmsCredential>();
  const [isCustomCsr, setIsCustomCsr] = useState<boolean>(false);
  const { createKmsCredential } = useCreateOkmsCredential({
    okmsId,
    onSuccess: (credential) => {
      if (credential.fromCSR) {
        // Navigate to the list if the credential is created from CSR
        navigate(KMS_ROUTES_URLS.credentialListing(okmsId));
      } else {
        // Else, go to the step 3
        setOkmsCredential(credential);
        setStep(3);
      }
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'create_access_certificate',
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'create_access_certificate',
      });
    },
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: okmsId,
      label: okms?.data?.iam?.displayName || '',
      navigateTo: KMS_ROUTES_URLS.kmsDashboard(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.credentials,
      label: t('key_management_service_credential'),
      navigateTo: KMS_ROUTES_URLS.credentialListing(okmsId),
    },
    {
      id: KMS_ROUTES_URIS.serviceKeyCreate,
      label: t('key_management_service_credential_create_title'),
      navigateTo: KMS_ROUTES_URLS.credentialCreate(okmsId),
    },
  ];

  if (isLoading) return <Loading />;

  if (error)
    return (
      <ErrorBanner
        error={error.response}
        onRedirectHome={() =>
          navigate(KMS_ROUTES_URLS.credentialListing(okmsId))
        }
      />
    );

  return (
    <Suspense fallback={<Loading />}>
      <BaseLayout
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        header={{
          title: t('key_management_service_credential_create_title'),
          description: t('key_management_service_credential_create_subtitle'),
          headerButton: <KmsGuidesHeader />,
          changelogButton: <KmsChangelogButton />,
        }}
        message={<Notifications />}
      >
        <IdentityDataProvider>
          <div className="w-full block">
            {step === 1 && (
              <CreateGeneralInformations
                name={name}
                setName={setName}
                validity={validity}
                setValidity={setValidity}
                description={description}
                setDescription={setDescription}
                csr={csr}
                setCsr={setCsr}
                certificateType={certificateType}
                setCertificateType={setCertificateType}
                isCustomCsr={isCustomCsr}
                setIsCustomCsr={setIsCustomCsr}
                nextStep={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <CreateAddIdentities
                identityURNs={identityURNs}
                setIdentityURNs={setIdentityURNs}
                prevStep={() => setStep(1)}
                nextStep={() =>
                  createKmsCredential({
                    name,
                    identityURNs,
                    description,
                    validity,
                    ...(csr && { csr }),
                    ...(certificateType && { certificateType }),
                  })
                }
              />
            )}
            {step === 3 && okmsCredential && (
              <CreateCredentialConfirmation okmsCredential={okmsCredential} />
            )}
          </div>
          <Outlet />
        </IdentityDataProvider>
      </BaseLayout>
    </Suspense>
  );
};

export default CreateCredential;
