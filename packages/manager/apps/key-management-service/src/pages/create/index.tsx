import React, { useState } from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { Title } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ROUTES_URLS } from '@/routes/routes.constants';
import RegionSelector from '@/components/layout-helpers/Create/RegionSelector';
import OrderConfirmation from '@/components/layout-helpers/Create/OrderConfirmation';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

export default function Create() {
  const { t } = useTranslation('key-management-service/create');
  const [isOrderInitiated, setIsOrderInitiated] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(undefined);

  return (
    <div className="m-10">
      <Breadcrumb
        items={[
          {
            id: ROUTES_URLS.createKeyManagementService,
            label: t('key_management_service_create_title'),
            navigateTo: ROUTES_URLS.createKeyManagementService,
          },
        ]}
      />
      <div className="flex items-center justify-between mt-4 mb-2">
        <Title>{t('key_management_service_create_title')}</Title>
        <KmsGuidesHeader />
      </div>
      <OdsText className="block mb-5" preset={ODS_TEXT_PRESET.paragraph}>
        {t('key_management_service_create_subtitle')}
      </OdsText>
      {!isOrderInitiated ? (
        <RegionSelector
          setOrderInitiated={() => setIsOrderInitiated(true)}
          selectRegion={setSelectedRegion}
          selectedRegion={selectedRegion}
        />
      ) : (
        <OrderConfirmation region={selectedRegion} />
      )}
    </div>
  );
}
