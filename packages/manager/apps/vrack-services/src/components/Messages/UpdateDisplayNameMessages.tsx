import React from 'react';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { MutationState, useMutationState } from '@tanstack/react-query';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  updateServiceNameMutationKey,
  UpdateServiceNameMutationParams,
} from '@ovhcloud/manager-components';
import { MessagesContext } from './Messages.context';

type UpdateDisplayNameMutation = MutationState<
  unknown,
  ApiError,
  UpdateServiceNameMutationParams,
  unknown
>;

export type UpdateDisplayNameMessageProps = {
  id?: string;
};

export const UpdateDisplayNameMessage: React.FC<UpdateDisplayNameMessageProps> = ({
  id,
}) => {
  const { t } = useTranslation('vrack-services/listing');
  const { hiddenMessages, hideMessage } = React.useContext(MessagesContext);
  const updateDisplayNameMutations = useMutationState<
    UpdateDisplayNameMutation
  >({
    filters: {
      mutationKey: updateServiceNameMutationKey,
      exact: true,
    },
  });

  if (!updateDisplayNameMutations.length) {
    return null;
  }

  return (
    <>
      {updateDisplayNameMutations
        .filter(
          (updateMutation: UpdateDisplayNameMutation) =>
            updateMutation.status === 'success' &&
            !hiddenMessages.includes(updateMutation.submittedAt) &&
            (updateMutation.variables.resourceName === id || !id),
        )
        .map((updateMutation) => (
          <OsdsMessage
            key={updateMutation.submittedAt}
            type={ODS_MESSAGE_TYPE.success}
            className="mb-8"
            removable
            onOdsRemoveClick={() => hideMessage(updateMutation.submittedAt)}
          >
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('updateDisplayNameSuccess', {
                vrackServices: updateMutation.variables.resourceName,
              })}
            </OsdsText>
          </OsdsMessage>
        ))}
    </>
  );
};
