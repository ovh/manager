import React from 'react';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  VrackServicesResourceStatus,
  VrackServicesWithIAM,
  useVrackServicesList,
} from '@ovh-ux/manager-network-common';
import { getDisplayName } from '@/utils/vrack-services';

const shouldDisplayMessage = (vs: VrackServicesWithIAM) =>
  vs.resourceStatus !== VrackServicesResourceStatus.READY;

const OperationMessage: React.FC<{ vs?: VrackServicesWithIAM }> = ({ vs }) => {
  const { t } = useTranslation('vrack-services');
  const isError = vs?.resourceStatus === VrackServicesResourceStatus.ERROR;

  if (!vs || !shouldDisplayMessage(vs)) {
    return null;
  }

  return (
    <OdsMessage
      color={
        isError ? ODS_MESSAGE_COLOR.critical : ODS_MESSAGE_COLOR.information
      }
      className="mb-8"
    >
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t(
          isError
            ? 'vrackServicesInErrorMessage'
            : 'vrackServicesNotReadyInfoMessage',
          {
            displayName: getDisplayName(vs),
          },
        )}
      </OdsText>
    </OdsMessage>
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
