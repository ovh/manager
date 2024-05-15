import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';

interface LabelChipProps {
  id: string;
  children: string;
}

const LabelChip: React.FC<LabelChipProps> = ({ id, children }) => {
  const navigate = useNavigate();
  const handleLinkClick = () => {
    navigate(`..?organizationId=${id}`);
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
