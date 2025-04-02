import React from 'react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { VrackServicesWithIAM } from '@ovh-ux/manager-network-common';
import { EditButton } from './EditButton.component';
import { urls } from '@/routes/routes.constants';
import { InfoIcon } from './InfoIcon.component';
import { isEditable, getDisplayName } from '@/utils/vrack-services';

export type DisplayNameProps = {
  isListing?: boolean;
} & VrackServicesWithIAM;

export const DisplayName: React.FC<DisplayNameProps> = ({
  isListing,
  ...vs
}) => {
  const { trackClick } = useOvhTracking();
  const name = getDisplayName(vs);
  const navigate = useNavigate();

  return isListing ? (
    <div className="flex">
      <OdsLink
        className="overflow-hidden text-ellipsis max-w-[200px]"
        label={name}
        href=""
        onClick={(event) => {
          event.preventDefault();
          trackClick({
            location: PageLocation.datagrid,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['details_vrack-services'],
          });
          navigate(urls.overview.replace(':id', vs.id));
        }}
      />
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
