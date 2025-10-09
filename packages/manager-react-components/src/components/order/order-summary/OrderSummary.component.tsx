import { useEffect, FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useOrderContext } from '../Order.context';
import { Link, LinkType } from '../../Link';
import { Button } from '../../button';
import { Text } from '../../text';
import { OrderSummaryProps } from './OrderSummary.type';

export const OrderSummary: FC<OrderSummaryProps> = ({
  onFinish,
  onClickLink,
  orderLink,
  productName,
}: OrderSummaryProps): JSX.Element => {
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
    <section className="flex flex-col gap-4">
      <Text preset={ODS_TEXT_PRESET.heading2} data-testid="order-summary-title">
        {t('order_summary_order_initiated_title', { product })}
      </Text>
      <Text preset={ODS_TEXT_PRESET.paragraph}>
        <Trans
          t={t}
          i18nKey="order_summary_order_initiated_subtitle"
          components={{
            ExternalLink: (
              <Link
                type={LinkType.external}
                target="_blank"
                href={orderLink}
                data-testid="order-summary-link"
                onClick={onClickLink}
              />
            ),
          }}
        />
      </Text>
      <Text preset={ODS_TEXT_PRESET.paragraph}>
        {t('order_summary_order_initiated_info', { product })}
      </Text>
      <Button
        className="w-fit"
        data-testid="cta-order-summary-finish"
        onClick={() => {
          onFinish();
          setIsOrderInitialized(false);
        }}
      >
        {t('order_summary_finish')}
      </Button>
    </section>
  );
};
