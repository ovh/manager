import React from 'react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import {
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsSpinner,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { EditButton } from './edit-button.component';
import { ResourceStatus, VrackServicesWithIAM, isEditable } from '@/api';
import { urls } from '@/router/constants';

const InfoIcon: React.FC<{ className?: string; vs: VrackServicesWithIAM }> = ({
  className,
  vs,
}) => {
  const { t } = useTranslation('vrack-services/dashboard');
  const displayName = vs?.iam?.displayName || vs?.id;
  const size = ODS_ICON_SIZE.xs;

  if (vs.resourceStatus === ResourceStatus.READY) {
    return null;
  }

  return (
    <OsdsTooltip>
      {vs.resourceStatus === ResourceStatus.ERROR ? (
        <OsdsIcon
          className={className}
          color={ODS_THEME_COLOR_INTENT.warning}
          size={size}
          name={ODS_ICON_NAME.WARNING_CIRCLE}
        />
      ) : (
        <OsdsSpinner
          className={className}
          style={{ maxWidth: 20 }}
          size={ODS_SPINNER_SIZE.sm}
        />
      )}
      <OsdsTooltipContent slot="tooltip-content">
        {vs.resourceStatus === ResourceStatus.ERROR ? (
          <OsdsMessage color={ODS_THEME_COLOR_INTENT.warning}>
            {t('vrackServicesInErrorMessage', { displayName })}
          </OsdsMessage>
        ) : (
          t('vrackServicesNotReadyInfoMessage', { displayName })
        )}
      </OsdsTooltipContent>
    </OsdsTooltip>
  );
};

export const DisplayName: React.FC<VrackServicesWithIAM & {
  isListing?: boolean;
}> = ({ isListing, ...vs }) => {
  const { trackClick } = useOvhTracking();
  const name = vs.iam?.displayName || vs.id;
  const navigate = useNavigate();

  return isListing ? (
    <div className="flex align-center text-center justify-center">
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
