import React, { Suspense, useState } from 'react';
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
import CreateGeneralInformations from '@/components/credential/create/CreateGeneralInformations.component';
import CreateAddIdentities from '@/components/credential/create/CreateAddIdentities.component';

const CreateCredential = () => {
  const navigate = useNavigate();
  const { okmsId } = useParams();
  const { data: okms, isLoading, error } = useOKMSById(okmsId);
  const { t } = useTranslation('key-management-service/credential');
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [validity, setValidity] = useState<number>(30);
  const [description, setDescription] = useState<string | null>();
  const [csr, setCsr] = useState<string | null>(null);
  const [identityURNs, setIdentityURNs] = useState<string[]>([]);
  const { createKmsCredential } = useCreateOkmsCredential({
    okmsId,
    onSuccess: () => {
      navigate(`/${okmsId}/${ROUTES_URLS.credentials}`);
    },
    onError: () => {},
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
                    csr,
                    validity,
                  });
                }}
              ></CreateAddIdentities>
            )}
          </div>
          <Outlet />
        </IdentityDataProvider>
      </BaseLayout>
    </Suspense>
  );
};

export default CreateCredential;
