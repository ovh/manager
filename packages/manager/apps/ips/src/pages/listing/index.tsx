import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BaseLayout } from '@ovh-ux/manager-react-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import Loading from '@/components/Loading/Loading';
import { urls } from '@/routes/routes.constant';
import { ListingContextProvider } from './listingContext';
import { IpDatagrid } from './components';

export default function Listing() {
  const navigate = useNavigate();
  const { t } = useTranslation('listing');

  const header = {
    title: t('title'),
  };

  return (
    <BaseLayout header={header}>
      <OdsButton
        className="mb-5"
        variant={ODS_BUTTON_VARIANT.outline}
        icon={ODS_ICON_NAME.plus}
        onClick={() => navigate(urls.order)}
        label={t('orderIps')}
      />
      <React.Suspense fallback={<Loading />}>
        <ListingContextProvider>
          <IpDatagrid />
        </ListingContextProvider>
      </React.Suspense>
    </BaseLayout>
  );
}
