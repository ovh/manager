import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { EditableText } from './editable-text.component';
import { VrackServicesWithIAM, useUpdateVrackServicesName } from '@/api';
import { isEditable } from '@/utils/vs-utils';
import { PageName } from '@/utils/tracking';

export const DisplayName: React.FC<VrackServicesWithIAM & {
  hasLinkToDetails?: boolean;
}> = ({ hasLinkToDetails, ...vs }) => {
  const { trackClick, trackPage } = useOvhTracking();
  const name = vs.iam?.displayName || vs.id;
  const navigate = useNavigate();
  const navigateToDetails = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['details_vrack-services'],
    });
    navigate(`/${vs.id}`);
  };

  const { updateVSName, isPending } = useUpdateVrackServicesName({
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.pendingUpdateVrackServices,
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorUpdateVrackServices,
      });
    },
  });

  return (
    <EditableText
      disabled={!isEditable(vs) || isPending}
      defaultValue={name}
      onEditSubmitted={async (value) => {
        await updateVSName({
          vrackServices: vs.id,
          displayName: value || null,
        });
      }}
    >
      {hasLinkToDetails ? (
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={navigateToDetails}
        >
          {name}
        </OsdsLink>
      ) : (
        name
      )}
    </EditableText>
  );
};
