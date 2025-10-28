import React from 'react';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { HeaderProps } from './Header.props';

export const Header: React.FC<HeaderProps> = ({ title, guideMenu, changelogButton }) => {
  return (
    <header className="flex items-start justify-between">
      {title && <Text preset={TEXT_PRESET.heading1}>{title}</Text>}
      {(guideMenu || changelogButton) && (
        <div className="flex flex-wrap justify-end items-center">
          {changelogButton}
          {guideMenu}
        </div>
      )}
    </header>
  );
};

export default Header;
