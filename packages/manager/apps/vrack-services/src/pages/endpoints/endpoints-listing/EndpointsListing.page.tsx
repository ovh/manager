import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  ICON_NAME,
  Button,
  Icon,
} from '@ovhcloud/ods-react';
import { useVrackService } from '@ovh-ux/manager-network-common';
import { BaseLayout } from '@ovh-ux/muk';
import { EndpointDatagrid } from './EndpointDataGrid.component';
import { useNavigateToCreateEndpointPage } from '../endpoints.hook';
import { isEditable } from '@/utils/vrack-services';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export default function EndpointsListing() {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.endpoints);
  const { data: vs } = useVrackService();
  const navigateToCreateEndpointPage = useNavigateToCreateEndpointPage();

  return (
    <>
      <BaseLayout>
        <Button
          disabled={!isEditable(vs)}
          className="my-4"
          size={BUTTON_SIZE.sm}
          variant={BUTTON_VARIANT.outline}
          onClick={navigateToCreateEndpointPage}
        >
          <Icon name={ICON_NAME.plus} />
          {t('createEndpointButtonLabel')}
        </Button>
        <section>
          <EndpointDatagrid />
        </section>
      </BaseLayout>
      <React.Suspense>
        <Outlet />
      </React.Suspense>
    </>
  );
}
