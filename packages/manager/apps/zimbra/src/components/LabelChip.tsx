import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ODS_BADGE_SIZE } from '@ovhcloud/ods-components';

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
    <div
      onClick={handleLinkClick}
      role="button"
      aria-hidden="true"
      className="cursor-pointer inline-block"
    >
      <OdsBadge id={id} label={children} size={ODS_BADGE_SIZE.lg} />
    </div>
  );
};

export default LabelChip;
