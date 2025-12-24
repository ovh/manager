import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import Loading from '@/components/Loading/Loading';
import { ManageOrganisationsDatagrid } from '@/pages/listing/manageOrganisations/components/OrganisationsDatagrid/manageOrganisationsDataGrid.component';
import { urls } from '@/routes/routes.constant';

import './manage.organisations.scss';

export default function ManageOrganisationsPage() {
  const { t } = useTranslation('manage-organisations');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  return (
    <>
      <div className="flex flex-col">
        <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-4">
          {t('manageOrganisationsTabDescription')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mb-4">
          {t('manageOrganisationsPageDescription')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mb-4">
          {t('manageOrganisationsPageHowto')}
        </OdsText>
      </div>
      <div className="mb-2 flex flex-row">
        <OdsButton
          className="mb-5 mr-2"
          variant={ODS_BUTTON_VARIANT.outline}
          icon={ODS_ICON_NAME.plus}
          onClick={() => {
            trackClick({
              actionType: 'action',
              buttonType: ButtonType.button,
              location: PageLocation.page,
              actions: ['add_organization'],
            });
            navigate(urls.openOrganisationsModal);
          }}
          label={t('manageOrganisationsOrderButtonLabel')}
        />
      </div>
      <React.Suspense fallback={<Loading />}>
        <ManageOrganisationsDatagrid />
      </React.Suspense>
    </>
  );
}
