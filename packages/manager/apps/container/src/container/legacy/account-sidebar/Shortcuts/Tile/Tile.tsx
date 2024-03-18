import React from 'react';

import { useTranslation } from 'react-i18next';

import { useShell } from '@/context';
import { TRANSLATE_NAMESPACE } from '../../constants';
import { OsdsTile, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { Shortcut } from './shortcut';

type Props = {
  shortcut: Shortcut;
};

const Tile = ({ shortcut = {} as Shortcut }: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();

  const translationBase = 'user_account_menu_shortcuts_tile';

  const handleShortcutClick = (param: Shortcut) => {
    if (param?.tracking) {
      shell.getPlugin('tracking').trackClick({
        name: param.tracking,
        type: 'navigation',
      });
    }
  };

  return (
    <div className="m-1">
      <a
        href={shortcut.url}
        target="_top"
        onClick={() => handleShortcutClick(shortcut)}
        className="block"
      >
        <OsdsTile
          hoverable
          variant={ODS_TILE_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {shortcut.icon}
        </OsdsTile>
        <div className='flex justify-center items-center'>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._200}
          level={ODS_TEXT_LEVEL.body}
          className="font-bold text-center"
        >
          {t(`${translationBase}_${shortcut.id}`)}
        </OsdsText></div>
      </a>
    </div>
  );
};

export default Tile;
