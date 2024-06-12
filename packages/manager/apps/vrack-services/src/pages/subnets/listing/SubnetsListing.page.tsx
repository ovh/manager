import React from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsMessage,
  OsdsIcon,
  OsdsButton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { Outlet, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { PageLayout } from '@/components/layout-helpers';
import { SubnetDatagrid } from './SubnetDatagrid.component';
import { useNavigateToCreateSubnetPage } from '../subnets.hook';
import { hasSubnet, useVrackService } from '@/data';
import { urls } from '@/routes/routes.constants';

export default function SubnetsListing() {
  const { id } = useParams();
  const { t } = useTranslation('vrack-services/subnets');
  const navigateToCreateSubnetPage = useNavigateToCreateSubnetPage();

  const { data: vs } = useVrackService();

  if (!hasSubnet(vs)) {
    return <Navigate to={urls.subnetsOnboarding.replace(':id', id)} />;
  }

  return (
    <>
      <PageLayout noBreacrumb>
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.info}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('betaSubnetLimitMessage')}
          </OsdsText>
        </OsdsMessage>
        <OsdsButton
          // Disabled because for the beta user can only have 1 subnet per vRack Services
          disabled={hasSubnet(vs) || undefined}
          // TODO: Uncomment after the beta
          // disabled={!isEditable(vrackServices) || undefined}
          className="my-4"
          inline
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={navigateToCreateSubnetPage}
        >
          {t('createSubnetButtonLabel')}
          <span slot="start">
            <OsdsIcon
              name={ODS_ICON_NAME.ADD}
              size={ODS_ICON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </span>
        </OsdsButton>

        <section>
          <SubnetDatagrid />
        </section>
      </PageLayout>
      <Outlet />
    </>
  );
}
