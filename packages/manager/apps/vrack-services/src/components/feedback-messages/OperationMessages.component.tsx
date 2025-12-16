import React from 'react';
import {
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import {
  VrackServicesResourceStatus,
  VrackServicesWithIAM,
  useVrackServicesList,
} from '@ovh-ux/manager-network-common';
import { getDisplayName } from '@/utils/vrack-services';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

const shouldDisplayMessage = (vs: VrackServicesWithIAM) =>
  vs.resourceStatus !== VrackServicesResourceStatus.READY;

const OperationMessage: React.FC<{ vs?: VrackServicesWithIAM }> = ({ vs }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.common);
  const isError = vs?.resourceStatus === VrackServicesResourceStatus.ERROR;

  if (!vs || !shouldDisplayMessage(vs)) {
    return null;
  }

  return isError ? (
    <Message
      dismissible={false}
      color={MESSAGE_COLOR.critical}
      className="mb-8"
    >
      <MessageIcon name="hexagon-exclamation" />
      <MessageBody>
        {t('vrackServicesInErrorMessage', { displayName: getDisplayName(vs) })}
      </MessageBody>
    </Message>
  ) : (
    <Message
      dismissible={false}
      color={MESSAGE_COLOR.information}
      className="mb-8"
    >
      <MessageIcon name="circle-info" />
      <MessageBody>
        {t('vrackServicesNotReadyInfoMessage', {
          displayName: getDisplayName(vs),
        })}
      </MessageBody>
    </Message>
  );
};

export const OperationMessages: React.FC<{ id?: string }> = ({ id }) => {
  const { data: vrackServicesList } = useVrackServicesList();

  if (vrackServicesList?.data?.length === 0) {
    return null;
  }

  return id ? (
    <OperationMessage vs={vrackServicesList?.data.find((vs) => vs.id === id)} />
  ) : (
    <>
      {vrackServicesList?.data.map((vs) => (
        <OperationMessage key={vs.id} vs={vs} />
      ))}
    </>
  );
};
