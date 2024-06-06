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
import { deleteVrackServicesQueryKey, VrackServicesWithIAM } from '@/api';
import { useVrackServicesList } from '@/utils/vs-utils';

const ResiliationMessage: React.FC<{ vs?: VrackServicesWithIAM }> = ({
  vs,
}) => {
  const { t } = useTranslation('vrack-services/listing');
  const endpointTerminateServiceMutations = useMutationState({
    filters: {
      mutationKey: deleteVrackServicesQueryKey(vs.id),
      exact: true,
    },
  });

  if (!vs?.id) {
    return null;
  }

  return (
    <>
      {endpointTerminateServiceMutations[0]?.status === 'success' && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.success} className="mb-8">
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
      )}
    </>
  );
};

export const ResiliationMessages: React.FC<{ id?: string }> = ({ id }) => {
  const vrackServicesList = useVrackServicesList();

  if (vrackServicesList?.data?.data?.length === 0) {
    return null;
  }

  return id ? (
    <ResiliationMessage
      vs={vrackServicesList.data.data.find(
        (vs: VrackServicesWithIAM) => vs.id === id,
      )}
    />
  ) : (
    <>
      {vrackServicesList?.data?.data.map((vs: VrackServicesWithIAM) => (
        <ResiliationMessage key={vs.id} vs={vs} />
      ))}
    </>
  );
};
