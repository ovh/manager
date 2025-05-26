import React from 'react';
import { ChangelogButton, Headers } from '@ovh-ux/manager-react-components';
import { CHANGELOG_LINKS } from '@/constants';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="header mt-8">
      <Headers
        title={title}
        changelogButton={<ChangelogButton links={CHANGELOG_LINKS} />}
      />
    </div>
  );
};

export default Header;
