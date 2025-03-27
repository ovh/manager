import { OdsSpinner } from '@ovhcloud/ods-components/react';
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
        <OdsSpinner size="md" />
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
