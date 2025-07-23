import React from 'react';

import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { OdsLink } from '@ovhcloud/ods-components/react';

import { IconLinkAlignmentType } from '@ovh-ux/manager-react-components';
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
