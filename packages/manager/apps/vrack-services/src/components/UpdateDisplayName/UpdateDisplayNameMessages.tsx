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
  updateVrackServicesNameQueryKey,
  UpdateVrackServicesNameMutationParams,
} from '@/api';
import { UpdateDisplayNameContext } from './UpdateDisplayName.context';

type UpdateDisplayNameMutation = MutationState<
  unknown,
  ApiError,
  UpdateVrackServicesNameMutationParams,
  unknown
>;

export type UpdateDisplayNameMessageProps = {
  vrackServicesId?: string;
};

export const UpdateDisplayNameMessage: React.FC<UpdateDisplayNameMessageProps> = ({
  vrackServicesId,
}) => {
  const { t } = useTranslation('vrack-services/listing');
  const { hiddenMessages, hideMessage } = React.useContext(
    UpdateDisplayNameContext,
  );
  const updateDisplayNameMutations = useMutationState<
    UpdateDisplayNameMutation
  >({
    filters: {
      mutationKey: updateVrackServicesNameQueryKey,
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
            ['success', 'error'].includes(updateMutation.status) &&
            !hiddenMessages.includes(updateMutation.submittedAt),
        )
        .filter(
          ({ variables }) =>
            !vrackServicesId || vrackServicesId === variables.vrackServices,
        )
        .map((updateMutation) => (
          <OsdsMessage
            key={updateMutation.submittedAt}
            type={
              updateMutation.status === 'success'
                ? ODS_MESSAGE_TYPE.success
                : ODS_MESSAGE_TYPE.error
            }
            className="mb-8"
            removable
            onOdsRemoveClick={() => hideMessage(updateMutation.submittedAt)}
          >
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {updateMutation.status === 'success'
                ? t('updateDisplayNameSuccess', {
                    vrackServices: updateMutation.variables.vrackServices,
                  })
                : t('updateError', {
                    error: updateMutation.error?.response.data.message,
                  })}
            </OsdsText>
          </OsdsMessage>
        ))}
    </>
  );
};
