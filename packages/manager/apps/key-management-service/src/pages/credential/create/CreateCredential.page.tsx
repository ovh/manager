import React, { Suspense, useEffect, useState } from 'react';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import {
  BaseLayout,
  ErrorBanner,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { useOKMSById } from '@/data/hooks/useOKMS';
import Loading from '@/components/Loading/Loading';
import { IdentityDataProvider } from '@/hooks/credential/useIdentityData';
import { useCreateOkmsCredential } from '@/data/hooks/useCreateOkmsCredential';
import CreateGeneralInformations from '@/pages/credential/create/CreateGeneralInformations.component';
import CreateAddIdentities from '@/pages/credential/create/CreateAddIdentities.component';
import CreateCredentialConfirmation from '@/pages/credential/create/confirmation/CreateCredentialConfirmation.component';
import { OkmsCredential } from '@/types/okmsCredential.type';

const CreateCredential = () => {
  const navigate = useNavigate();
  const { trackPage } = useOvhTracking();
  const { okmsId } = useParams();
  const { data: okms, isLoading, error } = useOKMSById(okmsId);
  const { t } = useTranslation('key-management-service/credential');
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [validity, setValidity] = useState<number>(30);
  const [description, setDescription] = useState<string | null>();
  const [csr, setCsr] = useState<string | null>(null);
  const [identityURNs, setIdentityURNs] = useState<string[]>([]);
  const [okmsCredential, setOkmsCredential] = useState<OkmsCredential>();
  const [isCustomCsr, setIsCustomCsr] = useState<boolean>(false);
  const { createKmsCredential } = useCreateOkmsCredential({
    okmsId,
    onSuccess: (credential) => {
      setOkmsCredential(credential);
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
      label: okms?.data?.iam?.displayName,
      navigateTo: `/${okmsId}`,
    },
    {
      id: ROUTES_URLS.credentials,
      label: t('key_management_service_credential'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}`,
    },
    {
      id: ROUTES_URLS.createKmsServiceKey,
      label: t('key_management_service_credential_create_title'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}/${ROUTES_URLS.createCredential}`,
    },
  ];

  useEffect(() => {
    if (okmsCredential) {
      if (!okmsCredential.fromCSR) {
        setStep(3);
      } else {
        navigate(`/${okmsId}/${ROUTES_URLS.credentials}`);
      }
    }
  }, [okmsCredential]);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <ErrorBanner
        error={error.response}
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
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
        }}
      >
        <IdentityDataProvider>
          <div className="w-full block">
            <div className="mb-6">
              <Notifications />
            </div>
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
                isCustomCsr={isCustomCsr}
                setIsCustomCsr={setIsCustomCsr}
                nextStep={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <CreateAddIdentities
                identityURNs={identityURNs}
                setIdentityURNs={setIdentityURNs}
                prevStep={() => {
                  setStep(1);
                }}
                nextStep={() => {
                  createKmsCredential({
                    name,
                    identityURNs,
                    description,
                    validity,
                    ...(csr ? { csr } : {}),
                  });
                }}
              ></CreateAddIdentities>
            )}
            {step === 3 && (
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
