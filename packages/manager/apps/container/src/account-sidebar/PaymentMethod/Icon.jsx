import React from 'react';

const Icon = ({ defaultPaymentMethod }) => {
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

export default Icon;
