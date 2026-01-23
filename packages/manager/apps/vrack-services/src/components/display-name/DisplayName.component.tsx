import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Link } from '@ovhcloud/ods-react';

import type { VrackServicesWithIAM } from '@ovh-ux/manager-network-common';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { urls } from '@/routes/RoutesAndUrl.constants';
import { getDisplayName, isEditable } from '@/utils/vrack-services';

import { EditButton } from './EditButton.component';
import { InfoIcon } from './InfoIcon.component';

export type DisplayNameProps = {
  isListing?: boolean;
} & VrackServicesWithIAM;

export const DisplayName: React.FC<DisplayNameProps> = ({ isListing, ...vs }) => {
  const { trackClick } = useOvhTracking();
  const name = getDisplayName(vs);
  const navigate = useNavigate();

  return isListing ? (
    <div className="flex">
      <Link
        className="max-w-48 overflow-hidden text-ellipsis"
        href=""
        onClick={(event: React.MouseEvent) => {
          event.preventDefault();
          trackClick({
            location: PageLocation.datagrid,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['details_vrack-services'],
          });
          navigate(urls.overview.replace(':id', vs.id));
        }}
      >
        {name}
      </Link>
      <InfoIcon className="ml-4" vs={vs} />
    </div>
  ) : (
    <EditButton
      isDisabled={!isEditable(vs)}
      onClick={() => {
        trackClick({
          location: PageLocation.tile,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['edit_vrack-services'],
        });
        navigate(urls.overviewEdit.replace(':id', vs.id));
      }}
    >
      {name}
    </EditButton>
  );
};
