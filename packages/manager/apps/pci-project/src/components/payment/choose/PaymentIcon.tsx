import React from 'react';
import { OdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { TPaymentMethodIcon } from '@/data/types/payment/payment-method.type';

const PaymentIcon: React.FC<{ icon: TPaymentMethodIcon | undefined }> = ({
  icon,
}) => {
  if (!icon) {
    return null;
  }
  if (icon.data || icon.url) {
    return (
      <img
        src={icon.data || icon.url || ''}
        alt={icon.name}
        className="max-h-8 max-w-8"
      />
    );
  }
  if (icon.componentIcon) {
    return (
      <OdsIcon
        name={icon.componentIcon as ODS_ICON_NAME}
        className="max-h-8 max-w-8"
      />
    );
  }
  return null;
};

export default PaymentIcon;
