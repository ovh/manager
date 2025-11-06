import { JSX } from 'react';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import type { HeaderProps } from '@/components/base-layout/header/Header.props';

export function Header({ title, guideMenu, changelogButton }: HeaderProps): JSX.Element {
  const hasActions = !!guideMenu || !!changelogButton;

  return (
    <header className="flex items-start justify-between">
      {title != null && title !== '' && <Text preset={TEXT_PRESET.heading1}>{title}</Text>}

      {hasActions && (
        <div className="flex flex-wrap justify-end items-center">
          {changelogButton ?? null}
          {guideMenu ?? null}
        </div>
      )}
    </header>
  );
}

Header.displayName = 'Header';

export default Header;
