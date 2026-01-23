import React from 'react';

import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

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
  SPINNER_SIZE,
  Spinner,
} from '@ovhcloud/ods-react';

import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { OrderDescription, useOrderPollingStatus } from '@ovh-ux/manager-module-order';
import {
  getVrackServicesResourceListQueryKey,
  useVrackServicesList,
} from '@ovh-ux/manager-network-common';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, ChangelogMenu } from '@ovh-ux/muk';

import { DeliveringMessages } from '@/components/feedback-messages/DeliveringMessages.component';
import { SuccessMessages } from '@/components/feedback-messages/SuccessMessages.component';
import { VrackServicesDatagrid } from '@/pages/listing/VrackServicesDataGrid.component';
import { urls } from '@/routes/RoutesAndUrl.constants';
import { CHANGELOG_LINKS, TRANSLATION_NAMESPACES } from '@/utils/constants';

const betaVrackServicesLimit = 20;

export default function Listing() {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const location = useLocation();
  const [reachedBetaLimit, setReachedBetaLimit] = React.useState(false);
  const { data: features, isSuccess } = useFeatureAvailability(['vrack-services:order']);

  const { data: vrackServicesDeliveringOrders, isLoading: areOrdersLoading } =
    useOrderPollingStatus({
      pollingKey: OrderDescription.vrackServices,
      queryToInvalidateOnDelivered: getVrackServicesResourceListQueryKey,
    });

  const { data, isLoading } = useVrackServicesList();

  React.useEffect(() => {
    if (data?.data) {
      setReachedBetaLimit(data.data.length >= betaVrackServicesLimit);
    }
  }, [data?.data]);

  if (
    !isLoading &&
    !areOrdersLoading &&
    !(location.state as { fromOrder: boolean })?.fromOrder &&
    data?.data.length === 0 &&
    vrackServicesDeliveringOrders?.length === 0
  ) {
    return <Navigate to={urls.onboarding} />;
  }

  return (
    <>
      <BaseLayout
        header={{
          title: t('listingTitle'),
          changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
        }}
        description={t('listingDescription')}
        message={
          <>
            <SuccessMessages />
            <DeliveringMessages
              messageKey="deliveringVrackServicesMessage"
              orders={vrackServicesDeliveringOrders}
            />
            {reachedBetaLimit && (
              <Message dismissible={false} className="my-4" color={MESSAGE_COLOR.information}>
                <MessageIcon name="circle-info" />
                <MessageBody>{t('betaVrackServicesLimitMessage')}</MessageBody>
              </Message>
            )}
          </>
        }
      >
        {isSuccess && features['vrack-services:order'] && (
          <Button
            className="mb-8 block"
            disabled={reachedBetaLimit}
            variant={BUTTON_VARIANT.outline}
            size={BUTTON_SIZE.sm}
            onClick={() => {
              trackClick({
                location: PageLocation.page,
                buttonType: ButtonType.button,
                actionType: 'navigation',
                actions: ['add_vrack-services'],
              });
              navigate(urls.createVrackServices);
            }}
          >
            <Icon name={ICON_NAME.plus} />
            {t('createVrackServicesButtonLabel')}
          </Button>
        )}
        {isLoading || areOrdersLoading ? (
          <div>
            <Spinner size={SPINNER_SIZE.lg} />
          </div>
        ) : (
          <VrackServicesDatagrid />
        )}
      </BaseLayout>
      <React.Suspense>
        <Outlet />
      </React.Suspense>
    </>
  );
}
