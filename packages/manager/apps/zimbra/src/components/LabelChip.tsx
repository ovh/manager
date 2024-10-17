import React from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
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
    <OdsButton
      color={ODS_BUTTON_COLOR.primary}
      inline-block
      variant={ODS_BUTTON_VARIANT.outline}
      onClick={handleLinkClick}
      label={children}
    />
  );
};

export default LabelChip;
