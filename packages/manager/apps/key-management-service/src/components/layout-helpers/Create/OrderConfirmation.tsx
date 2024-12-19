import React, { useEffect } from 'react';
import { useOrderURL } from '@ovh-ux/manager-module-order';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsText, OdsButton, OdsCard } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_PRESET,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import { LinkType, Links, Subtitle } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { getKMSExpressOrderLink } from './order-utils';

type OrderConfirmationProps = {
  region: string;
};

const OrderConfirmation = ({ region }: OrderConfirmationProps) => {
  const { t } = useTranslation('key-management-service/create');
  const { trackClick } = useOvhTracking();
  const orderBaseUrl = useOrderURL('express_review_base');
  const navigate = useNavigate();
  const orderLink = React.useMemo(
    () => getKMSExpressOrderLink({ orderBaseUrl, region }),
    [region],
  );

  useEffect(() => {
    if (orderLink) {
      window.open(orderLink, '_blank', 'noopener,noreferrer');
    }
  }, [orderLink]);

  return (
    <>
      <OdsCard className="mb-6 p-4">
        <div className="flex flex-col gap-6 mb-6">
          <Subtitle>
            {t('key_management_service_create_order_initiated_title')}
          </Subtitle>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('key_management_service_create_order_initiated_subtitle')}
          </OdsText>
          <Links
            type={LinkType.external}
            label={orderLink}
            target="_blank"
            href={orderLink}
            onClickReturn={() =>
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.externalLink,
                actionType: 'navigation',
                actions: ['go-back-order'],
              })
            }
          />
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('key_management_service_create_order_initiated_info')}
          </OdsText>
        </div>
      </OdsCard>
      <OdsButton
        size={ODS_BUTTON_SIZE.md}
        color={ODS_BUTTON_COLOR.primary}
        onClick={() => {
          trackClick({
            location: PageLocation.funnel,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['finish'],
          });
          navigate(ROUTES_URLS.root, { state: { hasPendingOrder: true } });
        }}
        label={t('key_management_service_create_order_initiated_cta_done')}
      />
    </>
  );
};

export default OrderConfirmation;
