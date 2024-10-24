import React from 'react';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import {
  ODS_LINK_COLOR,
  ODS_LINK_ICON_ALIGNMENT,
} from '@ovhcloud/ods-components';
import { IconLinkAlignmentType } from '@ovh-ux/manager-react-components';

interface IdLinkProps {
  id: string;
  label: string;
}

const IdLink: React.FC<IdLinkProps> = ({ id, label }) => {
  const navigate = useNavigate();
  const handleLinkClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate(`..?organizationId=${id}`);
  };

  return (
    <OdsLink
      color={ODS_LINK_COLOR.primary}
      onClick={handleLinkClick}
      label={label}
      iconAlignment={IconLinkAlignmentType.left}
      href={`#`}
    />
  );
};

export default IdLink;
