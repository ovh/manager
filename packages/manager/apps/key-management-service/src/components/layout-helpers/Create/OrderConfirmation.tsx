import React, { useEffect } from 'react';
import { useOrderURL } from '@ovh-ux/manager-module-order';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsText, OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_PRESET,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import { LinkType, Links } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { getKMSExpressOrderLink } from './order-utils';
import { CREATE_KMS_TEST_IDS } from '@/pages/create/createKms.constants';

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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <OdsText preset={ODS_TEXT_PRESET.heading2}>
          {t('key_management_service_create_order_initiated_title')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('key_management_service_create_order_initiated_subtitle')}
        </OdsText>
        <Links
          type={LinkType.external}
          label={orderLink}
          target="_blank"
          href={orderLink}
          data-testid={CREATE_KMS_TEST_IDS.orderLink}
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
      <OdsButton
        size={ODS_BUTTON_SIZE.md}
        color={ODS_BUTTON_COLOR.primary}
        data-testid={CREATE_KMS_TEST_IDS.ctaFinish}
        onClick={() => {
          trackClick({
            location: PageLocation.funnel,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['finish'],
          });
          navigate(KMS_ROUTES_URLS.kmsListing, {
            state: { hasPendingOrder: true },
          });
        }}
        label={t('key_management_service_create_order_initiated_cta_done')}
      />
    </div>
  );
};

export default OrderConfirmation;
