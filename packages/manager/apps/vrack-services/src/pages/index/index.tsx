import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import {
  useOrderPollingStatus,
  OrderDescription,
  getVrackServicesResourceListQueryKey,
} from '@/api';
import { VrackServicesDatagrid } from '@/pages/index/components/VrackServicesDataGrid';
import { BreadcrumbHandleParams } from '@/components/Breadcrumb';
import { PageLayout } from '@/components/layout-helpers';
import { ErrorPage } from '@/components/Error';
import { DeliveringMessages } from '@/components/DeliveringMessages';
import { handleClick } from '@/utils/ods-utils';
import { useVrackServicesList } from '@/utils/vs-utils';

const betaVrackServicesLimit = 20;

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.id;
}

export default function ListingPage() {
  const { t } = useTranslation('vrack-services/listing');
  const navigate = useNavigate();
  const [reachedBetaLimit, setReachedBetaLimit] = React.useState(false);

  const {
    data: vrackServicesDeliveringOrders,
    isLoading: areOrdersLoading,
  } = useOrderPollingStatus({
    pollingKey: OrderDescription.vrackServices,
    queryToInvalidateOnDelivered: getVrackServicesResourceListQueryKey,
  });

  const { data, isLoading, error } = useVrackServicesList();

  React.useEffect(() => {
    setReachedBetaLimit(data?.data?.length >= betaVrackServicesLimit);
  }, [data?.data]);

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (
    !isLoading &&
    !areOrdersLoading &&
    data?.data.length === 0 &&
    vrackServicesDeliveringOrders?.length === 0
  ) {
    return <Navigate to="onboarding" />;
  }

  return (
    <PageLayout>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._600}
        className="block mt-7 mb-5"
      >
        {t('title')}
      </OsdsText>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        className="block mb-8"
      >
        {t('description')}
      </OsdsText>
      {reachedBetaLimit && (
        <OsdsMessage className="my-4" type={ODS_MESSAGE_TYPE.info}>
          {t('betaVrackServicesLimitMessage')}
        </OsdsMessage>
      )}
      <OsdsButton
        className="mb-8"
        inline
        disabled={reachedBetaLimit || undefined}
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        size={ODS_BUTTON_SIZE.sm}
        {...handleClick(() => navigate('create', { replace: true }))}
      >
        <OsdsIcon
          className="mr-4"
          name={ODS_ICON_NAME.ADD}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
        {t('createVrackServicesButtonLabel')}
      </OsdsButton>

      <DeliveringMessages
        message={t('deliveringVrackServicesMessage')}
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
