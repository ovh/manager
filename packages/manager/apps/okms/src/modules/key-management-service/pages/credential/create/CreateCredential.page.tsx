import { Suspense, useState } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import Breadcrumb from '@key-management-service/components/breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@key-management-service/components/guide/KmsGuidesHeader';
import { KmsChangelogButton } from '@key-management-service/components/kms-changelog-button/KmsChangelogButton.component';
import { useCreateOkmsCredential } from '@key-management-service/data/hooks/useCreateOkmsCredential';
import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { BreadcrumbItem } from '@key-management-service/hooks/breadcrumb/useBreadcrumb';
import { IdentityDataProvider } from '@key-management-service/hooks/credential/useIdentityData';
import CreateAddIdentities from '@key-management-service/pages/credential/create/CreateAddIdentities.component';
import CreateGeneralInformations from '@key-management-service/pages/credential/create/CreateGeneralInformations.component';
import CreateCredentialConfirmation from '@key-management-service/pages/credential/create/confirmation/CreateCredentialConfirmation.component';
import { KMS_ROUTES_URIS, KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { CertificateType, OkmsCredential } from '@key-management-service/types/okmsCredential.type';
import { useTranslation } from 'react-i18next';

import { BaseLayout, ErrorBanner, Notifications } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import Loading from '@/common/components/loading/Loading';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

const CreateCredential = () => {
  const navigate = useNavigate();
  const { trackPage } = useOkmsTracking();
  const { okmsId } = useRequiredParams('okmsId');
  const { data: okms, isLoading, error } = useOkmsById(okmsId);
  const { t } = useTranslation('key-management-service/credential');
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string | null>(null);
  const [validity, setValidity] = useState<number>(30);
  const [description, setDescription] = useState<string | null>(null);
  const [csr, setCsr] = useState<string | null>(null);
  const [certificateType, setCertificateType] = useState<CertificateType | null>(null);
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
        pageTags: ['create', 'credential'],
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageTags: ['create', 'credential'],
      });
    },
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: okmsId,
      label: okms?.iam?.displayName || '',
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

  const handleCreateCredential = () => {
    if (!name) {
      return;
    }

    createKmsCredential({
      name,
      identityURNs,
      description,
      validity,
      ...(certificateType && { certificateType }),
      ...(csr && { csr }),
    });
  };

  if (isLoading) return <Loading />;

  if (error)
    return (
      <ErrorBanner
        error={error.response}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.credentialListing(okmsId))}
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
          <div className="block w-full">
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
                nextStep={handleCreateCredential}
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
