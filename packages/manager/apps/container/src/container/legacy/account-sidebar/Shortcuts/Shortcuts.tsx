import React from 'react';
import { useTranslation } from 'react-i18next';
import { TRANSLATE_NAMESPACE } from '../constants';
import Tile from './Tile';
import useShortcuts from './useShortcuts';

const Shortcuts = (): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shortcuts = useShortcuts().getShortcuts();

  const translationBase = 'user_account_menu_shortcuts';

  return (
    <div className="mb-4" data-navi-id="account-sidebar-shortcuts-block">
      <h3 className="text-lg font-bold mb-2">
        {t(`${translationBase}_title`)}
      </h3>
      <div
        className={`flex flex-wrap ${
          shortcuts.length > 2 ? 'justify-around' : 'justify-start'
        }`}
      >
        {shortcuts.map((shortcut) => (
          <div key={shortcut.id} className="max-w-1/3 flex-1">
            <Tile shortcut={shortcut} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shortcuts;
