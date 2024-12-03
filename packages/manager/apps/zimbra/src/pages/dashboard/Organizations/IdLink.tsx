import React from 'react';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { IconLinkAlignmentType } from '@ovh-ux/manager-react-components';
import { useGenerateUrl } from '@/hooks';

interface IdLinkProps {
  id: string;
  label: string;
}

const IdLink: React.FC<IdLinkProps> = ({ id, label }) => {
  const navigate = useNavigate();
  const url = useGenerateUrl('..', 'href', {
    organizationId: id,
  });

  const handleLinkClick = () => {
    navigate(url);
  };

  return (
    <OdsLink
      color={ODS_LINK_COLOR.primary}
      onClick={handleLinkClick}
      label={label}
      iconAlignment={IconLinkAlignmentType.left}
      href={url}
    />
  );
};

export default IdLink;
