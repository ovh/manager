import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BUTTON_VARIANT, ICON_NAME, Icon } from '@ovhcloud/ods-react';
import { useOrderContext } from '../Order.context';
import { Button } from '../../button';
import { OrderConfigurationProps } from './OrderConfiguration.props';
import { Text } from '../../text';

export const OrderConfiguration: FC<OrderConfigurationProps> = ({
  children,
  onCancel,
  onConfirm,
  isValid,
}: OrderConfigurationProps): JSX.Element => {
  const { isOrderInitialized, setIsOrderInitialized, error } =
    useOrderContext();
  const { t } = useTranslation('order');

  if (isOrderInitialized) {
    return null;
  }

  if (error) {
    return <Text>{t('order_error_loading')}</Text>;
  }

  return (
    <>
      {children}
      <div className="flex flex-row gap-4">
        <Button
          variant={BUTTON_VARIANT.ghost}
          onClick={onCancel}
          data-testid="cta-order-configuration-cancel"
        >
          {t('order_configuration_cancel')}
        </Button>
        <Button
          disabled={!isValid}
          onClick={() => {
            onConfirm();
            setIsOrderInitialized(true);
          }}
          data-testid="cta-order-configuration-order"
        >
          <>
            <Icon name={ICON_NAME.externalLink} />
            {t('order_configuration_order')}
          </>
        </Button>
      </div>
    </>
  );
};
