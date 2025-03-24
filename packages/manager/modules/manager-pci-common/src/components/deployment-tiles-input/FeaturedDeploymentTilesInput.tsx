import React from 'react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import {
  DeploymentTilesInput,
  DeploymentTilesInputProps,
} from '@/components/deployment-tiles-input/DeploymentTilesInput';
import { useFeaturedDeploymentModes } from '@/api/hook/useFeaturedDeploymentModes';

export type FeaturedDeploymentTilesInputProps = Omit<
  DeploymentTilesInputProps,
  'deployments'
>;

export const FeaturedDeploymentTilesInput = ({
  value,
  onChange,
  name,
  ...otherProps
}: FeaturedDeploymentTilesInputProps) => {
  const { deployments, isPending } = useFeaturedDeploymentModes();

  return (
    <div aria-live="polite" aria-busy={isPending}>
      {isPending ? (
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
      ) : (
        <DeploymentTilesInput
          {...otherProps}
          value={value}
          onChange={onChange}
          deployments={deployments}
          name={name}
        />
      )}
    </div>
  );
};
