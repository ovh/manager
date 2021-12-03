import React from 'react';
import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../constants';

const Details = ({ translationBase, cssBaseClassName, defaultPaymentMethod }) => {
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

export default Details;
