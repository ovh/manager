import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import { useOrderContext } from './Order.context';
import { TransExternalLink } from '../typography/links/TransExternalLink.component';

export type TOrderSummary = {
  onFinish: () => void;
  onClickLink?: () => void;
  orderLink: string;
  productName?: string;
};

export const OrderSummary: React.FC<TOrderSummary> = ({
  onFinish,
  onClickLink,
  orderLink,
  productName,
}: TOrderSummary): JSX.Element => {
  const { t } = useTranslation('order');
  const { isOrderInitialized, setIsOrderInitialized } = useOrderContext();

  useEffect(() => {
    if (orderLink && isOrderInitialized) {
      window.open(orderLink, '_blank', 'noopener,noreferrer');
    }
  }, [orderLink, isOrderInitialized]);

  if (!isOrderInitialized) {
    return <></>;
  }

  // set default label if no product name provided
  const product = productName || t('order_summary_product_default_label');

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <OdsText
          preset={ODS_TEXT_PRESET.heading2}
          data-testid="order-summary-title"
        >
          {t('order_summary_order_initiated_title', { product })}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <TransExternalLink
            i18nNamespace="order"
            i18nKey="order_summary_order_initiated_subtitle"
            href={orderLink}
            onClickReturn={onClickLink}
          />
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('order_summary_order_initiated_info', { product })}
        </OdsText>
      </div>
      <OdsButton
        size={ODS_BUTTON_SIZE.md}
        color={ODS_BUTTON_COLOR.primary}
        data-testid="cta-order-summary-finish"
        onClick={() => {
          onFinish();
          setIsOrderInitialized(false);
        }}
        label={t('order_summary_finish')}
      />
    </div>
  );
};
