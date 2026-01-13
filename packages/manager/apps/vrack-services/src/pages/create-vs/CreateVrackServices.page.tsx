import React, { useEffect } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { useVrackServicesRegion } from '@ovh-ux/manager-network-common';
import { Error } from '@ovh-ux/muk';

import { CreatePageLayout } from '@/components/layout-helpers/CreatePageLayout.component';
import { urls } from '@/routes/RoutesAndUrl.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import { RegionFormField } from './RegionFormField.component';

export default function CreateVrackServicesPage() {
  const [selectedRegion, setSelectedRegion] = React.useState('');
  const { t } = useTranslation(TRANSLATION_NAMESPACES.create);
  const navigate = useNavigate();
  const { data: features, isSuccess } = useFeatureAvailability(['vrack-services:order']);

  useEffect(() => {
    if (isSuccess && !features['vrack-services:order']) {
      navigate(urls.listing);
    }
  }, [isSuccess, features, navigate]);

  const { isLoading: isRegionLoading, isError: hasRegionError, error } = useVrackServicesRegion();

  if (hasRegionError) {
    return <Error error={error} />;
  }

  return (
    <>
      <CreatePageLayout
        title={t('createPageTitle')}
        createButtonLabel={t('createButtonLabel')}
        confirmActionsTracking={['activate_vrack-service', selectedRegion]}
        onSubmit={() => navigate(urls.createConfirm.replace(':region', selectedRegion))}
        isFormSubmittable={!isRegionLoading && !!selectedRegion}
      >
        <RegionFormField selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
      </CreatePageLayout>
      <Outlet />
    </>
  );
}
