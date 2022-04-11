import React from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../constants';

import { PaymentMethod } from './usePaymentMethod';

type Props = {
  cssBaseClassName: string;
  defaultPaymentMethod: PaymentMethod;
  translationBase: string;
};

const Details = ({
  cssBaseClassName,
  defaultPaymentMethod,
  translationBase,
}: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  return (
    <div
      className="m-auto p-1 minw-0 w-100"
    >
      <h3>
        { t(`${translationBase}_title`)}
      </h3>
    {defaultPaymentMethod ? (
      <div
        className={`${cssBaseClassName}_label`}
      >
        <p
            className="m-0 text-truncate"
        >
          { defaultPaymentMethod.label }
        </p>
        <span
          className={`${cssBaseClassName}_status oui-badge oui-badge_${defaultPaymentMethod.getStatusCategory()}`}
        >
          { t(`${translationBase}_status_${defaultPaymentMethod.status}`) }
        </span>
      </div>
    ) : (
      <p>
        { t(`${translationBase}_none`)}
      </p>
    )}
    </div>
  );
};

Details.propTypes = {
  cssBaseClassName: PropTypes.string,
  defaultPaymentMethod: PropTypes.object,
  translationBase: PropTypes.string,
};

Details.defaultProps = {
  defaultPaymentMethod: {},
};

export default Details;
