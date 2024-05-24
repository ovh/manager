import React from 'react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { EditButton } from './edit-button.component';
import { VrackServicesWithIAM, isEditable } from '@/api';
import { urls } from '@/router/constants';

export const DisplayName: React.FC<VrackServicesWithIAM & {
  isListing?: boolean;
}> = ({ isListing, ...vs }) => {
  const { trackClick } = useOvhTracking();
  const name = vs.iam?.displayName || vs.id;
  const navigate = useNavigate();

  return isListing ? (
    <div>
      <OsdsLink
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
    </div>
  ) : (
    <EditButton
      disabled={!isEditable(vs)}
      urn={vs.iam.urn}
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
