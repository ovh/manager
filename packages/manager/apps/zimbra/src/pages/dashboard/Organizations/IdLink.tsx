import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';

interface IdLinkProps {
  id: string;
  children: string;
}

const IdLink: React.FC<IdLinkProps> = ({ id, children }) => {
  const navigate = useNavigate();
  const handleLinkClick = () => {
    navigate(`..?organizationId=${id}`);
  };

  return (
    <OsdsLink color={ODS_THEME_COLOR_INTENT.primary} onClick={handleLinkClick}>
      {children}
    </OsdsLink>
  );
};

export default IdLink;
