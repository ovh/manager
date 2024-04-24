import React, { useEffect, useState } from 'react';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { MutationState, useMutationState } from '@tanstack/react-query';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  updateVrackServicesNameQueryKey,
  UpdateVrackServicesNameMutationParams,
} from '@/api';

export const UpdateDisplayNameMessage: React.FC = () => {
  const { t } = useTranslation('vrack-services/listing');
  const updateDisplayNameMutations = useMutationState<
    MutationState<
      unknown,
      Error,
      UpdateVrackServicesNameMutationParams,
      unknown
    >
  >({
    filters: {
      mutationKey: updateVrackServicesNameQueryKey(),
      exact: true,
    },
  });

  const [displayMessage, setDisplayMessage] = useState([]);

  useEffect(() => {
    setDisplayMessage(
      Array.from({ length: updateDisplayNameMutations.length }, () => true),
    );
  }, [updateDisplayNameMutations]);

  if (!updateDisplayNameMutations.length) {
    return null;
  }

  return (
    <>
      {updateDisplayNameMutations.map(
        (
          updateMutation: MutationState<
            unknown,
            Error,
            UpdateVrackServicesNameMutationParams,
            unknown
          >,
          mutationIndex: number,
        ) =>
          updateMutation.status === 'success' &&
          displayMessage[mutationIndex] !== false && (
            <OsdsMessage
              key={updateMutation.variables.vrackServices + mutationIndex}
              type={ODS_MESSAGE_TYPE.success}
              className="mb-8"
              removable
              onOdsRemoveClick={() => {
                const newDisplayMessage = [...displayMessage];
                newDisplayMessage[mutationIndex] = false;
                setDisplayMessage(newDisplayMessage);
              }}
            >
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('updateDisplayNameSuccess', {
                  vrackServices: updateMutation.variables.vrackServices,
                })}
              </OsdsText>
            </OsdsMessage>
          ),
      )}
    </>
  );
};
