import React from 'react';

import { useTranslation } from 'react-i18next';

import { useShell } from '@/context';
import { TRANSLATE_NAMESPACE } from '../../constants';

import { UsefulLink } from './usefulLink';

type Props = {
  link?: UsefulLink;
  translationBase?: string;
};

const Anchor = ({
  link = {} as UsefulLink,
  translationBase = '',
}: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();
  const handleLinkClick = (linkParam: UsefulLink): void => {
    if (linkParam?.tracking) {
      shell.getPlugin('tracking').trackClick({
        name: linkParam.tracking,
        type: 'navigation',
      });
    }
  };

  return (
    <a
      className="d-flex"
      target="_blank"
      rel="noreferrer"
      href={link.href}
      onClick={() => handleLinkClick(link)}
    >
      {link.icon && <span className={link.icon} aria-hidden="true"></span>}
      <span>{t(`${translationBase}_${link.id}`)}</span>
    </a>
  );
};

export default Anchor;
