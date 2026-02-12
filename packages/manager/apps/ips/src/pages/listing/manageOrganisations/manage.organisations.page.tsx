import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  TEXT_PRESET,
  Button,
  Text,
} from '@ovhcloud/ods-react';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import Loading from '@/components/Loading/Loading';
import { ManageOrganisationsDatagrid } from '@/pages/listing/manageOrganisations/components/OrganisationsDatagrid/manageOrganisationsDataGrid.component';
import { urls } from '@/routes/routes.constant';

export default function ManageOrganisationsPage() {
  const { t } = useTranslation('manage-organisations');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  return (
    <>
      <div className="flex flex-col">
        <Text preset={TEXT_PRESET.heading3} className="mb-4">
          {t('manageOrganisationsTabDescription')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph} className="mb-4">
          {t('manageOrganisationsPageDescription')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph} className="mb-4">
          {t('manageOrganisationsPageHowto')}
        </Text>
      </div>
      <div className="mb-2 flex flex-row">
        <Button
          className="mb-5 mr-2"
          variant={BUTTON_VARIANT.outline}
          onClick={() => {
            trackClick({
              actionType: 'action',
              buttonType: ButtonType.button,
              location: PageLocation.page,
              actions: ['add_organization'],
            });
            navigate(urls.openOrganisationsModal);
          }}
        >
          <Icon name={ICON_NAME.plus} className="mr-2" />
          {t('manageOrganisationsOrderButtonLabel')}
        </Button>
      </div>
      <React.Suspense fallback={<Loading />}>
        <ManageOrganisationsDatagrid />
      </React.Suspense>
    </>
  );
}
