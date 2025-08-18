import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Outlet } from 'react-router-dom';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import Loading from '@/components/Loading/Loading';
import { urls } from '@/routes/routes.constant';
import { IpDatagrid } from './components';
import { IpFilter, TypeFilter, QuickFilter } from './components/filters';
import { ListingContextProvider } from '../listingContext';
import { TRANSLATION_NAMESPACES } from '@/utils';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export default function IpListingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);
  return (
    <ListingContextProvider>
      <div className="flex flex-col">
        <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-4">
          {t('listingTabIpDescription')}
        </OdsText>
      </div>
      <div className="flex flex-row mb-4 items-baseline">
        <OdsButton
          className="mr-2"
          variant={ODS_BUTTON_VARIANT.outline}
          icon={ODS_ICON_NAME.plus}
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => navigate(urls.order)}
          label={t('orderIpsButtonLabel')}
        />
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          icon={ODS_ICON_NAME.plus}
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => navigate(urls.byoip)}
          label={t('orderByoipButtonLabel')}
        />
        <IpFilter />
        <TypeFilter />
        <QuickFilter />
        <div className="ml-auto">
          <ActionMenu
            id="settings"
            icon={ODS_ICON_NAME.cog}
            isCompact
            items={[
              {
                id: 0,
                label: t('listingSettingsImportIpFromSys'),
                onClick: () => navigate(urls.listingImportIpFromSys),
              },
            ]}
          />
        </div>
      </div>
      <React.Suspense fallback={<Loading />}>
        <IpDatagrid />
      </React.Suspense>
      <Outlet />
    </ListingContextProvider>
  );
}
