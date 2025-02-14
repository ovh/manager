import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { PageLayout } from '@/components/layout-helpers';
import { isEditable, useVrackService } from '@/data';
import { EndpointDatagrid } from './EndpointDataGrid.component';
import { useNavigateToCreateEndpointPage } from '../endpoints.hook';
import { IAM_ACTION } from '@/utils/iamActions.constants';

export default function EndpointsListing() {
  const { t } = useTranslation('vrack-services/endpoints');
  const { data: vs } = useVrackService();
  const navigateToCreateEndpointPage = useNavigateToCreateEndpointPage();

  return (
    <>
      <PageLayout noBreacrumb>
        <ManagerButton
          disabled={!isEditable(vs) || undefined}
          className="my-4"
          inline
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={navigateToCreateEndpointPage}
          iamActions={[
            IAM_ACTION.VRACK_SERVICES_RESOURCE_GET,
            IAM_ACTION.VRACK_SERVICES_ELIGIBLE_MANAGED_SERVICE_RESOURCE_GET,
          ]}
          urn={vs.iam?.urn}
        >
          {t('createEndpointButtonLabel')}
          <span slot="start">
            <OsdsIcon
              name={ODS_ICON_NAME.ADD}
              size={ODS_ICON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </span>
        </ManagerButton>

        <section>
          <EndpointDatagrid />
        </section>
      </PageLayout>
      <Outlet />
    </>
  );
}
