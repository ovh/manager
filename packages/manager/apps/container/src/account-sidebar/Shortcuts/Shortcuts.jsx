import React from 'react';
import { useTranslation } from 'react-i18next';

import Tile from './Tile';
import useShortcuts from './useShortcuts';
import { TRANSLATE_NAMESPACE } from '../constants';

const Shortcuts = ({ environment }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shortcuts = useShortcuts(environment).getShortcuts();

  const cssClassName = 'manager-account-sidebar-shortcuts';
  const translationBase = 'shortcuts';

  return (
    <div
      className="mb-4"
      data-navi-id="account-sidebar-shortcuts-block"
    >
      <h3>
        { t(`${translationBase}_title`) }
      </h3>
      <div
        className={`d-flex flex-wrap justify-content-${shortcuts.length > 2 ? 'around' : 'start'}`}
      >
      {shortcuts.map((shortcut, index) => (
        <div
          key={`shortcut-tile-${index}`}
          className={`${cssClassName}_links`}
        >
          <Tile
            shortcut={shortcut}
          />
        </div>
      ))}
      </div>
    </div>
  );
};

export default Shortcuts;
