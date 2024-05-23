import React from 'react';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { useMutationState } from '@tanstack/react-query';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  deleteVrackServicesQueryKey,
  VrackServicesWithIAM,
  useVrackServicesList,
} from '@/api';
import { MessagesContext } from './Messages.context';

const ResiliationSuccessMessage: React.FC<{ vs?: VrackServicesWithIAM }> = ({
  vs,
}) => {
  const { t } = useTranslation('vrack-services/listing');
  const { hiddenMessages, hideMessage } = React.useContext(MessagesContext);

  const endpointTerminateServiceMutations = useMutationState({
    filters: {
      mutationKey: deleteVrackServicesQueryKey(vs.id),
      exact: true,
    },
  });

  const lastMutation = endpointTerminateServiceMutations?.[0];

  if (
    !vs?.id ||
    lastMutation?.status !== 'success' ||
    hiddenMessages.includes(lastMutation?.submittedAt)
  ) {
    return null;
  }

  return (
    <OsdsMessage
      type={ODS_MESSAGE_TYPE.success}
      className="mb-8"
      removable
      onOdsRemoveClick={() => hideMessage(lastMutation?.submittedAt)}
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('endpointTerminateServiceSuccess', {
          vrackServices: vs.iam?.displayName || vs.id,
        })}
      </OsdsText>
    </OsdsMessage>
  );
};

export const ResiliationSuccessMessages: React.FC<{ id?: string }> = ({
  id,
}) => {
  const vrackServicesList = useVrackServicesList();

  if (!vrackServicesList?.data || vrackServicesList?.data?.data?.length === 0) {
    return null;
  }

  return id ? (
    <ResiliationSuccessMessage
      vs={vrackServicesList.data.data.find(
        (vs: VrackServicesWithIAM) => vs.id === id,
      )}
    />
  ) : (
    <>
      {vrackServicesList?.data?.data.map((vs: VrackServicesWithIAM) => (
        <ResiliationSuccessMessage key={vs.id} vs={vs} />
      ))}
    </>
  );
};
