import React from 'react';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useMutationState } from '@tanstack/react-query';
import { useVrackServicesList } from '@/utils/vs-utils';
import {
  ResourceStatus,
  VrackServicesWithIAM,
  updateVrackServicesQueryKey,
} from '@/api';
import { getSubnetCreationMutationKey } from '@/pages/subnets/constants';
import { getEndpointCreationMutationKey } from '@/pages/endpoints/constants';

const shouldDisplayMessage = (vs: VrackServicesWithIAM) =>
  [
    ResourceStatus.CREATING,
    ResourceStatus.UPDATING,
    ResourceStatus.DELETING,
    ResourceStatus.ERROR,
  ].includes(vs.resourceStatus);

const OperationMessage: React.FC<{ vs: VrackServicesWithIAM }> = ({ vs }) => {
  const { t } = useTranslation('vrack-services/dashboard');
  const isError = vs.resourceStatus === ResourceStatus.ERROR;
  const endpointCreationMutations = useMutationState({
    filters: {
      mutationKey: updateVrackServicesQueryKey(
        getEndpointCreationMutationKey(vs.id),
      ),
      exact: true,
    },
  });
  const subnetCreationMutations = useMutationState({
    filters: {
      mutationKey: updateVrackServicesQueryKey(
        getSubnetCreationMutationKey(vs.id),
      ),
      exact: true,
    },
  });

  if (!shouldDisplayMessage(vs)) {
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
            displayName: vs.displayName || vs.id,
          },
        )}
        {subnetCreationMutations[0]?.status === 'success' &&
          t('subnetCreationOnGoing', {
            name:
              vs?.targetSpec?.subnets?.[vs?.targetSpec.subnets.length - 1]
                ?.displayName ||
              vs?.targetSpec?.subnets?.[vs?.targetSpec.subnets.length - 1]
                ?.cidr,
          })}
        {endpointCreationMutations[0]?.status === 'success' &&
          t('endpointCreationOnGoing')}
      </OsdsText>
    </OsdsMessage>
  );
};

export const OperationMessages: React.FC<{ id?: string }> = ({ id }) => {
  const vrackServicesList = useVrackServicesList();

  return id ? (
    <OperationMessage
      vs={vrackServicesList?.data?.data.find((vs) => vs.id === id)}
    />
  ) : (
    <>
      {vrackServicesList?.data?.data.map((vs) => (
        <OperationMessage vs={vs} />
      ))}
    </>
  );
};
