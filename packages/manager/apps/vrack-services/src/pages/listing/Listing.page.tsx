import React from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  OsdsText,
  OsdsButton,
  OsdsMessage,
  OsdsSpinner,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
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
  ChangelogButton,
  handleClick,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import {
  getVrackServicesResourceListQueryKey,
  useVrackServicesList,
} from '@ovh-ux/manager-network-common';
import { VrackServicesDatagrid } from '@/pages/listing/VrackServicesDataGrid.component';
import { PageLayout } from '@/components/layout-helpers';
import { DeliveringMessages } from '@/components/DeliveringMessages.component';
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
    <PageLayout noBreacrumb>
      <div className="flex items-center justify-between">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._600}
          className="block mt-7 mb-5"
        >
          {t('listingTitle')}
        </OsdsText>
        <ChangelogButton links={CHANGELOG_LINKS} />
      </div>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        className="block mb-8"
      >
        {t('listingDescription')}
      </OsdsText>
      <SuccessMessages />
      {reachedBetaLimit && (
        <OsdsMessage className="my-4" type={ODS_MESSAGE_TYPE.info}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('betaVrackServicesLimitMessage')}
          </OsdsText>
        </OsdsMessage>
      )}
      {isSuccess && features['vrack-services:order'] && (
        <OsdsButton
          className="mb-8"
          inline
          disabled={reachedBetaLimit || undefined}
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.stroked}
          size={ODS_BUTTON_SIZE.sm}
          {...handleClick(() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: ['add_vrack-services'],
            });
            navigate(urls.createVrackServices);
          })}
        >
          <OsdsIcon
            className="mr-4"
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('createVrackServicesButtonLabel')}
        </OsdsButton>
      )}

      <DeliveringMessages
        messageKey="deliveringVrackServicesMessage"
        orders={vrackServicesDeliveringOrders}
      />
      {isLoading || areOrdersLoading ? (
        <div>
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
        </div>
      ) : (
        <VrackServicesDatagrid />
      )}
    </PageLayout>
  );
}
