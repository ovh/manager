import React from 'react';
import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../../constants';

const Button = ({ link, translationBase }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  return (
    <button
      className="btn btn-link d-flex"
      type="button"
      role="button"
    >
      {link.icon && (
        <span
          className={link.icon}
          aria-hidden="true"
        >
        </span>
      )}
      <span>
        { t(`${translationBase}_${link.id}`) }
      </span>
    </button>
  );
};

export default Button;
