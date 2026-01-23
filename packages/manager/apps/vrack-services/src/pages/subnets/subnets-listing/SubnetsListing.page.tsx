import React from 'react';

import { Navigate, Outlet, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  ICON_NAME,
  Icon,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { useVrackService } from '@ovh-ux/manager-network-common';
import { BaseLayout } from '@ovh-ux/muk';

import { urls } from '@/routes/RoutesAndUrl.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { hasSubnet } from '@/utils/vrack-services';

import { useNavigateToCreateSubnetPage } from '../subnets.hook';
import { SubnetDatagrid } from './SubnetDatagrid.component';

export default function SubnetsListing() {
  const { id } = useParams();
  const { t } = useTranslation(TRANSLATION_NAMESPACES.subnets);
  const navigateToCreateSubnetPage = useNavigateToCreateSubnetPage();

  const { data: vs } = useVrackService();

  if (!hasSubnet(vs)) {
    return <Navigate to={urls.subnetsOnboarding.replace(':id', id || '')} />;
  }

  return (
    <>
      <BaseLayout>
        <div className="flex flex-col gap-8">
          <Message dismissible={false} className="mt-4" color={MESSAGE_COLOR.information}>
            <MessageIcon name="circle-info" />
            <MessageBody>
              <Text preset={TEXT_PRESET.paragraph}>{t('betaSubnetLimitMessage')}</Text>
            </MessageBody>
          </Message>
        </div>
        <Button
          // Disabled because for the beta user can only have 1 subnet per vRack Services
          disabled={hasSubnet(vs)}
          // TODO: Uncomment after the beta
          // isDisabled={!isEditable(vrackServices)}
          className="my-4"
          size={BUTTON_SIZE.sm}
          variant={BUTTON_VARIANT.outline}
          onClick={navigateToCreateSubnetPage}
        >
          <Icon name={ICON_NAME.plus} />
          {t('createSubnetButtonLabel')}
        </Button>

        <section>
          <SubnetDatagrid />
        </section>
      </BaseLayout>
      <React.Suspense>
        <Outlet />
      </React.Suspense>
    </>
  );
}
