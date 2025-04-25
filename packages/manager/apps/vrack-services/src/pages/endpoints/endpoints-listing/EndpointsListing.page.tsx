import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { useVrackService } from '@ovh-ux/manager-network-common';
import { PageLayout } from '@ovh-ux/manager-react-components';
import { EndpointDatagrid } from './EndpointDataGrid.component';
import { useNavigateToCreateEndpointPage } from '../endpoints.hook';
import { isEditable } from '@/utils/vrack-services';

export default function EndpointsListing() {
  const { t } = useTranslation('vrack-services/endpoints');
  const { data: vs } = useVrackService();
  const navigateToCreateEndpointPage = useNavigateToCreateEndpointPage();

  return (
    <>
      <PageLayout>
        <OdsButton
          isDisabled={!isEditable(vs)}
          className="my-4"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.outline}
          onClick={navigateToCreateEndpointPage}
          icon={ODS_ICON_NAME.plus}
          label={t('createEndpointButtonLabel')}
        />
        <section>
          <EndpointDatagrid />
        </section>
      </PageLayout>
      <Outlet />
    </>
  );
}
