import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrderContext } from './Order.context';

export type TOrderConfiguration = {
  children: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  isValid: boolean;
};

export const OrderConfiguration: React.FC<TOrderConfiguration> = ({
  children,
  onCancel,
  onConfirm,
  isValid,
}: TOrderConfiguration): JSX.Element => {
  const { isOrderInitialized, setIsOrderInitialized } = useOrderContext();
  const { t } = useTranslation('order');

  if (isOrderInitialized) {
    return <></>;
  }

  return (
    <>
      {children}
      <div className="flex flex-row gap-4">
        <OdsButton
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_BUTTON_COLOR.primary}
          onClick={onCancel}
          label={t('order_configuration_cancel')}
          data-testid="cta-order-configuration-cancel"
        />
        <OdsButton
          size={ODS_BUTTON_SIZE.md}
          color={ODS_BUTTON_COLOR.primary}
          isDisabled={!isValid}
          onClick={() => {
            onConfirm();
            setIsOrderInitialized(true);
          }}
          icon={ODS_ICON_NAME.externalLink}
          iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.left}
          label={t('order_configuration_order')}
          data-testid="cta-order-configuration-order"
        />
      </div>
    </>
  );
};
