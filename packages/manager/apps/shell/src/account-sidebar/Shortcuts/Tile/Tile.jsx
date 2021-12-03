import React from 'react';
import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../../constants';

const Tile = ({ shortcut }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const cssClassName = 'manager-account-sidebar-shortcuts-tile';
  const translationBase = 'shortcuts_tile';

  return (
    <div
      className={cssClassName}
    >
      <a
        href={shortcut.url}
      >
        <span
          className={`${cssClassName}__icon oui-icon ${shortcut.icon}`}
          aria-hidden="true"
        ></span>
        <span
          className={`${cssClassName}__description`}
        >
          { t(`${translationBase}_${shortcut.id}`) }
        </span>
      </a>
  </div>
  );
};

export default Tile;
