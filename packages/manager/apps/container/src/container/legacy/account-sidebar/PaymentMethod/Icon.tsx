import React from 'react';
import { PaymentMethodType } from './usePaymentMethod';

import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type Props = {
  defaultPaymentMethod?: PaymentMethodType;
};

const Icon = ({ defaultPaymentMethod = {} }: Props): JSX.Element => {
  return (
    <>
      {!defaultPaymentMethod?.icon ? (
        <OsdsIcon
          className="mr-4"
          name={ODS_ICON_NAME.CREDIT_CARD_CONCEPT}
          size={ODS_ICON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
        ></OsdsIcon>
      ) : (
        <img
          src={defaultPaymentMethod.icon.data}
          alt={defaultPaymentMethod.icon.label || ''}
          aria-hidden="true"
          className="mr-1"
        />
      )}
    </>
  );
};

export default Icon;
