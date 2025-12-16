import React from 'react';
import {
  MESSAGE_COLOR,
  ICON_NAME,
  SPINNER_SIZE,
  Icon,
  Message,
  MessageBody,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import {
  VrackServicesResourceStatus,
  VrackServicesWithIAM,
} from '@ovh-ux/manager-network-common';
import { getDisplayName } from '@/utils/vrack-services';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export type InfoInconProps = {
  className?: string;
  vs: VrackServicesWithIAM;
};

export const InfoIcon: React.FC<InfoInconProps> = ({ className, vs }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.common);
  const displayName = getDisplayName(vs);

  if (vs.resourceStatus === VrackServicesResourceStatus.READY) {
    return null;
  }

  return (
    <>
      {vs.resourceStatus === VrackServicesResourceStatus.ERROR ? (
        <Tooltip>
          <TooltipTrigger>
            <Icon
              id={`${vs.id}-info`}
              className={className}
              name={ICON_NAME.triangleExclamation}
            />
          </TooltipTrigger>
          <TooltipContent withArrow>
            {vs.resourceStatus === VrackServicesResourceStatus.ERROR ? (
              <Message dismissible={false} color={MESSAGE_COLOR.warning}>
                <MessageIcon name="triangle-exclamation" />
                <MessageBody>
                  {t('vrackServicesInErrorMessage', { displayName })}
                </MessageBody>
              </Message>
            ) : (
              t('vrackServicesNotReadyInfoMessage', { displayName })
            )}
          </TooltipContent>
        </Tooltip>
      ) : (
        <Spinner
          className={className}
          style={{ maxWidth: 20 }}
          size={SPINNER_SIZE.sm}
        />
      )}
    </>
  );
};
