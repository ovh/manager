import React from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { useShell } from '@/context';
import { TRANSLATE_NAMESPACE } from '../../constants';

import { Shortcut } from './shortcut';

type Props = {
  shortcut: Shortcut;
};

const Tile = ({ shortcut }: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();

  const cssClassName = 'manager-account-sidebar-shortcuts-tile';
  const translationBase = 'user_account_menu_shortcuts_tile';

  const handleShortcutClick = (shortcut) => {
    if (shortcut?.tracking) {
      shell.getPlugin('tracking').trackClick({
        name: shortcut.tracking,
        type: 'navigation',
      });
    }
  };

  return (
    <div className={cssClassName}>
      <a
        href={shortcut.url}
        target="_top"
        onClick={() => handleShortcutClick(shortcut)}
      >
        <span
          className={`${cssClassName}__icon oui-icon ${shortcut.icon}`}
          aria-hidden="true"
        ></span>
        <span className={`${cssClassName}__description`}>
          {t(`${translationBase}_${shortcut.id}`)}
        </span>
      </a>
    </div>
  );
};

Tile.propTypes = {
  shortcut: PropTypes.object,
};

Tile.defaultProps = {
  shortcut: {},
};

export default Tile;
