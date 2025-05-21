import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Outlet } from 'react-router-dom';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import Loading from '@/components/Loading/Loading';
import { urls } from '@/routes/routes.constant';
import { IpDatagrid } from './components';
import { IpFilter, TypeFilter } from './components/filters';
import { ListingContextProvider } from '../listingContext';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export default function IpListingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('listing');
  return (
    <ListingContextProvider>
      <div className="flex flex-col">
        <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-4">
          {t('listingTabIpDescription')}
        </OdsText>
      </div>
      <div className="flex flex-row mb-2">
        <OdsButton
          className="mb-5 mr-2"
          variant={ODS_BUTTON_VARIANT.outline}
          icon={ODS_ICON_NAME.plus}
          onClick={() => navigate(urls.order)}
          label={t('orderIpsButtonLabel')}
        />
        <OdsButton
          className="mb-5"
          variant={ODS_BUTTON_VARIANT.outline}
          icon={ODS_ICON_NAME.plus}
          onClick={() => navigate(urls.byoip)}
          label={t('orderByoipButtonLabel')}
        />
        <IpFilter />
        <TypeFilter />
      </div>
      <React.Suspense fallback={<Loading />}>
        <IpDatagrid />
      </React.Suspense>
      <Outlet />
    </ListingContextProvider>
  );
}
