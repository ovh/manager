import React, { useState } from 'react';
import { OsdsText, OsdsDivider } from '@ovhcloud/ods-components/react';

import { Notifications } from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
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
      <div className={'flex items-center justify-between mt-4 mb-2'}>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('key_management_service_create_title')}
        </OsdsText>
        <KmsGuidesHeader />
      </div>
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._100}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('key_management_service_create_subtitle')}
      </OsdsText>
      <OsdsDivider></OsdsDivider>
      <Notifications />
      {!isOrderInitiated ? (
        <RegionSelector
          setOrderInitiated={() => {
            setIsOrderInitiated(true);
          }}
          selectRegion={setSelectedRegion}
          selectedRegion={selectedRegion}
        />
      ) : (
        <OrderConfirmation region={selectedRegion} />
      )}
    </div>
  );
}
