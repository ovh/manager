import React from 'react';
import {
  ChangelogButton,
  Headers,
  PciGuidesHeader,
} from '@ovh-ux/manager-react-components';
import { CHANGELOG_LINKS } from '@/constants';

interface HeaderProps {
  title: string;
  category?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  category = 'savings_plans',
}) => {
  return (
    <div className="header mt-8">
      <Headers
        title={title}
        headerButton={
          <div className="min-w-[7rem]">
            <PciGuidesHeader category={category} />
          </div>
        }
        changelogButton={<ChangelogButton links={CHANGELOG_LINKS} />}
      />
    </div>
  );
};

export default Header;
