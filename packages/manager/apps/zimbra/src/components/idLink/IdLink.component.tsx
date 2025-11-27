import React from 'react';

import { Link } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useGenerateUrl } from '@/hooks';
import { SELECT_ORGANIZATION } from '@/tracking.constants';

interface IdLinkProps {
  id: string;
  label: string;
}

export const IdLink: React.FC<IdLinkProps> = ({ id, label }) => {
  const { trackClick } = useOvhTracking();
  const url = useGenerateUrl('..', 'href', {
    organizationId: id,
  });

  const handleLinkClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [SELECT_ORGANIZATION],
    });
  };

  return (
    <Link onClick={handleLinkClick} href={url}>
      {label}
    </Link>
  );
};

export default IdLink;
