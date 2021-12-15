import React from 'react';
import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../../constants';

const Anchor = ({ link, translationBase }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  return (
    <a
      className="d-flex"
      target="_blank"
      rel="noopener"
      href={link.href}
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
    </a>
  );
};

export default Anchor;
