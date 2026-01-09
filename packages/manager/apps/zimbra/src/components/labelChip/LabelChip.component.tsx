import React from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { BADGE_SIZE, Badge } from '@ovhcloud/ods-react';

export interface LabelChipProps {
  id: string;
  children: string;
}

export const LabelChip: React.FC<LabelChipProps> = ({ id, children }) => {
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
      className="inline-block cursor-pointer"
    >
      <Badge id={id} size={BADGE_SIZE.lg}>
        {children}
      </Badge>
    </div>
  );
};

export default LabelChip;
