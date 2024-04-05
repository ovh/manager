import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { OsdsIcon, OsdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { PageLayout } from '@/components/layout-helpers';
import { isEditable, useVrackService } from '@/utils/vs-utils';
import { EndpointDatagrid } from './components/EndpointDataGrid';
import { useNavigateToCreateEndpointPage } from './endpoints.hook';
import { PageType } from '@/utils/tracking';

export default function EndpointsListing() {
  const { t } = useTranslation('vrack-services/endpoints');
  const { data: vrackServices } = useVrackService();
  const navigateToCreateEndpointPage = useNavigateToCreateEndpointPage(
    PageType.listing,
  );

  return (
    <>
      <PageLayout noBreacrumb>
        <OsdsButton
          disabled={!isEditable(vrackServices) || undefined}
          className="my-4"
          inline
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={navigateToCreateEndpointPage}
        >
          {t('createEndpointButtonLabel')}
          <span slot="start">
            <OsdsIcon
              name={ODS_ICON_NAME.ADD}
              size={ODS_ICON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </span>
        </OsdsButton>

        <section>
          <EndpointDatagrid />
        </section>
      </PageLayout>
      <Outlet />
    </>
  );
}
