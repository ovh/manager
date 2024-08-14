import React from 'react';
import { BaseLayout } from '@ovhcloud/manager-components';
import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { useOKMSById } from '@/data/hooks/useOKMS';

const CreateCredential = () => {
  const { okmsId } = useParams();
  const { data: okms, isLoading: okmsIsLoading } = useOKMSById(okmsId);
  const { t } = useTranslation('key-management-service/credential');

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

  return (
    <>
      <BaseLayout
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        header={{
          title: t('key_management_service_credential_create_title'),
          description: t('key_management_service_credential_create_subtitle'),
          headerButton: <KmsGuidesHeader />,
        }}
      />
      <Outlet />
    </>
  );
};

export default CreateCredential;
