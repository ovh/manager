import React from 'react';

import { useTranslation } from 'react-i18next';

import { MESSAGE_COLOR, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';

import { VrackServicesResourceStatus } from '@ovh-ux/manager-network-common';
import type { VrackServicesWithIAM } from '@ovh-ux/manager-network-common';

import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { getDisplayName } from '@/utils/vrack-services';

const shouldDisplayMessage = (vs: VrackServicesWithIAM) =>
  vs.resourceStatus !== VrackServicesResourceStatus.READY;

export const OperationMessage: React.FC<{ vs?: VrackServicesWithIAM }> = ({ vs }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.common);
  const isError = vs?.resourceStatus === VrackServicesResourceStatus.ERROR;

  if (!vs || !shouldDisplayMessage(vs)) {
    return null;
  }

  return isError ? (
    <Message dismissible={false} color={MESSAGE_COLOR.critical} className="mb-8">
      <MessageIcon name="hexagon-exclamation" />
      <MessageBody>
        {t('vrackServicesInErrorMessage', { displayName: getDisplayName(vs) })}
      </MessageBody>
    </Message>
  ) : (
    <Message dismissible={false} color={MESSAGE_COLOR.information} className="mb-8">
      <MessageIcon name="circle-info" />
      <MessageBody>
        {t('vrackServicesNotReadyInfoMessage', {
          displayName: getDisplayName(vs),
        })}
      </MessageBody>
    </Message>
  );
};
