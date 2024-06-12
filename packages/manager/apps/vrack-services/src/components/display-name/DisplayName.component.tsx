import React from 'react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { EditButton } from './EditButton.component';
import { VrackServicesWithIAM, getDisplayName, isEditable } from '@/data';
import { urls } from '@/routes/routes.constants';
import { InfoIcon } from './InfoIcon.component';

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
    <div className="flex align-center text-center justify-center">
      <OsdsLink
        className="overflow-hidden text-ellipsis max-w-[200px]"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
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
      </OsdsLink>
      <InfoIcon className="ml-4" vs={vs} />
    </div>
  ) : (
    <EditButton
      disabled={!isEditable(vs)}
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
