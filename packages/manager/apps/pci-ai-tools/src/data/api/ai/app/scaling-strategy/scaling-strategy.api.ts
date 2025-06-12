import { apiClient } from '@ovh-ux/manager-core-api';
import { AppData } from '@/data/api';
import ai from '@/types/AI';

export interface ScalingStrategyProps extends AppData {
  scalingStrat: ai.app.ScalingStrategyInput;
}

export const scalingStrategy = async ({
  projectId,
  appId,
  scalingStrat,
}: ScalingStrategyProps) =>
  apiClient.v6
    .put(
      `/cloud/project/${projectId}/ai/app/${appId}/scalingstrategy`,
      scalingStrat,
    )
    .then((res) => res.data as ai.app.App);
