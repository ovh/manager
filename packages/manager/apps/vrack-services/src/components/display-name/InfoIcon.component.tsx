import React from 'react';
import {
  OsdsIcon,
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
import { ResourceStatus, VrackServicesWithIAM, getDisplayName } from '@/data';

export type InfoInconProps = {
  className?: string;
  vs: VrackServicesWithIAM;
};

export const InfoIcon: React.FC<InfoInconProps> = ({ className, vs }) => {
  const { t } = useTranslation('vrack-services');
  const displayName = getDisplayName(vs);
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
