import React from 'react';

import { KeyPairName } from '@ovh-ux/manager-config/types/locale';
import { useTranslation } from 'react-i18next';

import style from './style.module.scss';
import { useShell } from '@/context';

type Props = {
  languages?: KeyPairName[];
  onSelect(key: string): void;
};

const LanguageMenu = ({ languages = [], onSelect }: Props): JSX.Element => {
  const { t } = useTranslation('language');
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');

  return (
    <div className="oui-navbar-menu__wrapper">
      <div className="oui-navbar-menu oui-navbar-menu_fixed oui-navbar-menu_end">
        <div className="oui-navbar-list_dropdown p-4">
          <span className={`oui-navbar-list__title ${style.title}`}>
            {t('language_change')}
          </span>
          <ul className="oui-navbar-list">
            {languages.map(({ name, key }) => (
              <li className="oui-navbar-list__item" key={key}>
                <button
                  className="oui-navbar-link oui-navbar-link_tertiary p-0"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect(key);
                    trackingPlugin.trackClick({
                      name: `topnav::language_selector::switch_to_${name}`,
                      type: 'action',
                    });
                  }}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LanguageMenu;
