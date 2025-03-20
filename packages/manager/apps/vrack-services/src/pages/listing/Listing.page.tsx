import React from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsText,
  OdsButton,
  OdsMessage,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
  ODS_MESSAGE_COLOR,
  ODS_SPINNER_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  useOrderPollingStatus,
  OrderDescription,
} from '@ovh-ux/manager-module-order';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  PageLayout,
  ChangelogButton,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import {
  getVrackServicesResourceListQueryKey,
  useVrackServicesList,
} from '@ovh-ux/manager-network-common';
import { VrackServicesDatagrid } from '@/pages/listing/VrackServicesDataGrid.component';
import { DeliveringMessages } from '@/components/feedback-messages/DeliveringMessages.component';
import { betaVrackServicesLimit } from './listing.constants';
import { urls } from '@/routes/routes.constants';
import { SuccessMessages } from '@/components/feedback-messages/SuccessMessage.component';
import { CHANGELOG_LINKS } from '@/utils/constants';

export default function Listing() {
  const { t } = useTranslation('vrack-services/listing');
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [reachedBetaLimit, setReachedBetaLimit] = React.useState(false);
  const { data: features, isSuccess } = useFeatureAvailability([
    'vrack-services:order',
  ]);

  const {
    data: vrackServicesDeliveringOrders,
    isLoading: areOrdersLoading,
  } = useOrderPollingStatus({
    pollingKey: OrderDescription.vrackServices,
    queryToInvalidateOnDelivered: getVrackServicesResourceListQueryKey,
  });

  const { data, isLoading } = useVrackServicesList();

  React.useEffect(() => {
    setReachedBetaLimit(data?.data?.length >= betaVrackServicesLimit);
  }, [data?.data]);

  if (
    !isLoading &&
    !areOrdersLoading &&
    !state?.fromOrder &&
    data?.data.length === 0 &&
    vrackServicesDeliveringOrders?.length === 0
  ) {
    return <Navigate to={urls.onboarding} />;
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between">
        <OdsText preset={ODS_TEXT_PRESET.heading2} className="block mt-7 mb-5">
          {t('listingTitle')}
        </OdsText>
        <ChangelogButton links={CHANGELOG_LINKS} />
      </div>
      <OdsText preset={ODS_TEXT_PRESET.paragraph} className="block mb-8">
        {t('listingDescription')}
      </OdsText>
      <SuccessMessages />
      {reachedBetaLimit && (
        <OdsMessage
          isDismissible={false}
          className="block my-4"
          color={ODS_MESSAGE_COLOR.information}
        >
          {t('betaVrackServicesLimitMessage')}
        </OdsMessage>
      )}
      {isSuccess && features['vrack-services:order'] && (
        <OdsButton
          className="block mb-8"
          isDisabled={reachedBetaLimit}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('createVrackServicesButtonLabel')}
          icon={ODS_ICON_NAME.plus}
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: ['add_vrack-services'],
            });
            navigate(urls.createVrackServices);
          }}
        />
      )}

      <DeliveringMessages
        messageKey="deliveringVrackServicesMessage"
        orders={vrackServicesDeliveringOrders}
      />
      {isLoading || areOrdersLoading ? (
        <div>
          <OdsSpinner size={ODS_SPINNER_SIZE.lg} />
        </div>
      ) : (
        <VrackServicesDatagrid />
      )}
    </PageLayout>
  );
}
