import React from 'react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import {
  DeploymentTilesInput,
  DeploymentTilesInputProps,
} from '@/components/deployment-tiles-input/DeploymentTilesInput';
import { useFeaturedDeploymentModes } from '@/api/hook/useFeaturedDeploymentModes';

export type DeploymentTilesInputForAppProps = Omit<
  DeploymentTilesInputProps,
  'deployments'
>;

export const DeploymentTilesInputForApp = ({
  value,
  onChange,
  name,
}: DeploymentTilesInputForAppProps) => {
  const { deployments, isPending } = useFeaturedDeploymentModes();

  return isPending ? (
    <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
  ) : (
    <DeploymentTilesInput
      value={value}
      onChange={onChange}
      deployments={deployments}
      name={name}
    />
  );
};
