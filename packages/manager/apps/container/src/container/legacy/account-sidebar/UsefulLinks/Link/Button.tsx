import React from 'react';

import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../../constants';

import { UsefulLink } from './usefulLink';

type Props = {
  link?: UsefulLink;
  translationBase?: string;
};

const Button = ({
  link = {} as UsefulLink,
  translationBase = '',
}: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  return (
    <button
      className="btn btn-link d-flex"
      type="button"
      role="button"
      onClick={link.action}
    >
      {link.icon && <span className={link.icon} aria-hidden="true"></span>}
      <span>{t(`${translationBase}_${link.id}`)}</span>
    </button>
  );
};

export default Button;
