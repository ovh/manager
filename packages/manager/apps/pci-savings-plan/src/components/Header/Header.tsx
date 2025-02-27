import React from 'react';
import { Headers, PciGuidesHeader } from '@ovh-ux/manager-react-components';

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
      <div className="flex items-center justify-between">
        <Headers title={title} />
        <PciGuidesHeader category={category} />
      </div>
    </div>
  );
};

export default Header;
