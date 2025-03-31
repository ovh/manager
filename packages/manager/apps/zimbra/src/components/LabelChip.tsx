import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ODS_BADGE_SIZE } from '@ovhcloud/ods-components';

interface LabelChipProps {
  id: string;
  children: string;
}

const LabelChip: React.FC<LabelChipProps> = ({ id, children }) => {
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (location.pathname.endsWith('organizations')) {
      navigate(`..?organizationId=${id}`);
    } else {
      setSearchParams((prev) => {
        prev.set('organizationId', id);
        return prev;
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
