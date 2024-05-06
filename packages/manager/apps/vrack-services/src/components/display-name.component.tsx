import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { EditableText, ManagerText } from '@ovhcloud/manager-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { VrackServicesWithIAM } from '@/api';
import { isEditable, useUpdateVrackServices } from '@/utils/vs-utils';
import { PageName } from '@/utils/tracking';

export const DisplayName: React.FC<VrackServicesWithIAM & {
  hasLinkToDetails?: boolean;
}> = ({ hasLinkToDetails, ...vs }) => {
  const { trackClick, trackPage } = useOvhTracking();
  const name = vs.currentState.displayName || vs.id;
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

  // TODO: we have to display the error for each vs on the listing
  const { updateVS } = useUpdateVrackServices({
    key: vs.id,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerInfo,
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
      disabled={!isEditable(vs)}
      defaultValue={name}
      onEditSubmitted={async (value) => {
        await updateVS({
          vrackServicesId: vs.id,
          checksum: vs.checksum,
          targetSpec: {
            displayName: value || null,
            subnets: vs.currentState.subnets || [],
          },
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
        <ManagerText
          urn={vs.iam.urn}
          action="vrackServices:apiovh:resource/get"
        >
          {name}
        </ManagerText>
      )}
    </EditableText>
  );
};
