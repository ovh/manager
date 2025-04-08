import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import Loading from '@/components/Loading/Loading';
import { ManageOrganisationsDatagrid } from '@/pages/listing/manageOrganisations/components/OrganisationsDatagrid/manageOrganisationsDataGrid.component';
import { urls } from '@/routes/routes.constant';
import { ManageOrgListingContextProvider } from './manage.organisations.context';

export default function ManageOrganisationsPage() {
  const { t } = useTranslation('manage-organisations');
  const navigate = useNavigate();
  return (
    <ManageOrgListingContextProvider>
      <div className="flex flex-col">
        <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-4">
          {t('manageOrganisationsTabDescription')}
        </OdsText>
      </div>
      <div className="flex flex-row mb-2">
        <OdsButton
          className="mb-5 mr-2"
          variant={ODS_BUTTON_VARIANT.outline}
          icon={ODS_ICON_NAME.plus}
          onClick={() => navigate(urls.openOrganisationsModel)}
          label={t('manageOrganisationsOrderButtonLabel')}
        />
      </div>
      <React.Suspense fallback={<Loading />}>
        <ManageOrganisationsDatagrid />
      </React.Suspense>
    </ManageOrgListingContextProvider>
  );
}
