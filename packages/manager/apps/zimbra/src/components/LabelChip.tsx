import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LabelChipProps {
  id: string;
  children: string;
}

const LabelChip: React.FC<LabelChipProps> = ({ id, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('organizationId', id);

    if (location.pathname.includes('organization')) {
      navigate(`..?organizationId=${id}`);
    } else {
      navigate({
        pathname: location.pathname,
        search: searchParams.toString(),
      });
    }
  };

  return (
    <OsdsChip
      inline
      color={ODS_THEME_COLOR_INTENT.primary}
      selectable
      onClick={handleLinkClick}
    >
      {children}
    </OsdsChip>
  );
};

export default LabelChip;
