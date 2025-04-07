import React from 'react';
import {
  OdsIcon,
  OdsMessage,
  OdsSpinner,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_COLOR,
  ODS_ICON_NAME,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  VrackServicesResourceStatus,
  VrackServicesWithIAM,
} from '@ovh-ux/manager-network-common';
import { getDisplayName } from '@/utils/vrack-services';

export type InfoInconProps = {
  className?: string;
  vs: VrackServicesWithIAM;
};

export const InfoIcon: React.FC<InfoInconProps> = ({ className, vs }) => {
  const { t } = useTranslation('vrack-services');
  const displayName = getDisplayName(vs);

  if (vs.resourceStatus === VrackServicesResourceStatus.READY) {
    return null;
  }

  return (
    <>
      {vs.resourceStatus === VrackServicesResourceStatus.ERROR ? (
        <OdsIcon
          id={`${vs.id}-info`}
          className={className}
          name={ODS_ICON_NAME.triangleExclamation}
        />
      ) : (
        <OdsSpinner
          className={className}
          style={{ maxWidth: 20 }}
          size={ODS_SPINNER_SIZE.sm}
        />
      )}
      <OdsTooltip triggerId={`${vs.id}-info`} withArrow>
        {vs.resourceStatus === VrackServicesResourceStatus.ERROR ? (
          <OdsMessage isDismissible={false} color={ODS_MESSAGE_COLOR.warning}>
            {t('vrackServicesInErrorMessage', { displayName })}
          </OdsMessage>
        ) : (
          t('vrackServicesNotReadyInfoMessage', { displayName })
        )}
      </OdsTooltip>
    </>
  );
};
