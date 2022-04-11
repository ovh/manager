import React from 'react';

import PropTypes from 'prop-types';

import { PaymentMethod } from './usePaymentMethod';

type Props = {
  defaultPaymentMethod: PaymentMethod;
};

const Icon = ({ defaultPaymentMethod }: Props): JSX.Element => {
  return (
    <>
    {!defaultPaymentMethod?.icon ? (
      <span
        className="mr-auto oui-icon oui-icon-credit-card_concept"
        aria-hidden="true"
      >
      </span>
    ) : (
      <img
        src={ defaultPaymentMethod.icon.data }
        alt={ defaultPaymentMethod.icon.label }
        aria-hidden="true"
        className="mr-1"
      />
    )}
    </>
  );
};

Icon.propTypes = {
  defaultPaymentMethod: PropTypes.object,
};

Icon.defaultProps = {
  defaultPaymentMethod: {},
};

export default Icon;
