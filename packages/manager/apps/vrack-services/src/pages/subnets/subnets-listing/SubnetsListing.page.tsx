import React from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import {
  OdsMessage,
  OdsIcon,
  OdsButton,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { Outlet, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVrackService } from '@ovh-ux/manager-network-common';
import { PageLayout } from '@/components/layout-helpers';
import { SubnetDatagrid } from './SubnetDatagrid.component';
import { useNavigateToCreateSubnetPage } from '../subnets.hook';
import { urls } from '@/routes/routes.constants';
import { hasSubnet } from '@/utils/vrack-services';

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
        <OdsMessage className="mt-4" color={ODS_MESSAGE_COLOR.information}>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('betaSubnetLimitMessage')}
          </OdsText>
        </OdsMessage>
        <OdsButton
          // Disabled because for the beta user can only have 1 subnet per vRack Services
          isDisabled={hasSubnet(vs) || undefined}
          // TODO: Uncomment after the beta
          // disabled={!isEditable(vrackServices) || undefined}
          className="my-4"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.outline}
          color={ODS_BUTTON_COLOR.primary}
          onClick={navigateToCreateSubnetPage}
          label={t('createSubnetButtonLabel')}
          icon={ODS_ICON_NAME.plus}
        />

        <section>
          <SubnetDatagrid />
        </section>
      </PageLayout>
      <Outlet />
    </>
  );
}
