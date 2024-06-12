import React from 'react';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  useVrackServicesList,
  ResourceStatus,
  VrackServicesWithIAM,
  getDisplayName,
} from '@/data';

const shouldDisplayMessage = (vs: VrackServicesWithIAM) =>
  vs.resourceStatus !== ResourceStatus.READY;

const OperationMessage: React.FC<{ vs?: VrackServicesWithIAM }> = ({ vs }) => {
  const { t } = useTranslation('vrack-services');
  const isError = vs?.resourceStatus === ResourceStatus.ERROR;

  if (!vs || !shouldDisplayMessage(vs)) {
    return null;
  }

  return (
    <OsdsMessage
      type={isError ? ODS_MESSAGE_TYPE.error : ODS_MESSAGE_TYPE.info}
      className="mb-8"
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t(
          isError
            ? 'vrackServicesInErrorMessage'
            : 'vrackServicesNotReadyInfoMessage',
          {
            displayName: getDisplayName(vs),
          },
        )}
      </OsdsText>
    </OsdsMessage>
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
