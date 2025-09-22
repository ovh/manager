import { ComponentType } from 'react';

import { useClusterCreationStepper } from '../hooks/useCusterCreationStepper';
import { ClusterConfirmationStep } from './ClusterConfirmStep.component';
import { ClusterNameStep } from './ClusterNameStep.component';
import Loader from './Loader';
import { LocationStep } from './LocationStep.component';
import { NetworkStep } from './NetworkStep.component';
import NodePoolStep from './NodePoolStep.component';
import PlanStep from './PlanStep.component';
import { VersionAndUpdatePolicyStep } from './VersionAndUpdatePolicyStep.component';

type StepComponentProps = Record<string, unknown>;

type StepConfig = {
  key: string;
  component: ComponentType<StepComponentProps> | string;
  titleKey: string;
  extraProps?: Record<string, unknown>;
  condition?: boolean;
};

const stepsConfig = ({
  stepper,
  createNewCluster,
  projectId,
  are3AZRegions,
}: {
  stepper: ReturnType<typeof useClusterCreationStepper>;
  createNewCluster: () => void;
  projectId?: string;
  are3AZRegions?: boolean;
}): StepConfig[] => [
  {
    key: 'clusterName',
    component: ClusterNameStep,
    titleKey: 'kubernetes_add_name_title',
    extraProps: { onNameChange: stepper.clusterName.update },
  },
  {
    key: 'location',
    component: LocationStep,
    titleKey: 'kubernetes_add_region_title',
    extraProps: {
      projectId,
    },
  },
  {
    key: 'plan',
    component: PlanStep,
    titleKey: 'kubernetes_add_plan_title',
    condition: are3AZRegions,
    extraProps: { type: stepper.form.region?.type },
  },
  {
    key: 'version',
    component: VersionAndUpdatePolicyStep,
    titleKey: 'kubernetes_add_version_and_upgrade_policy_title',
  },
  {
    key: 'network',
    component: NetworkStep,
    titleKey: 'listing:kubernetes_add_private_network',
    extraProps: {
      region: stepper.form.region?.name,
      type: stepper.form.region?.type,
    },
  },
  {
    key: 'node',
    component: NodePoolStep,
    titleKey: 'listing:kube_common_node_pool_title_multiple',
    extraProps: { stepper },
  },
  {
    key: 'confirm',
    component: !stepper.confirm.step.isLocked ? ClusterConfirmationStep : Loader,
    titleKey: 'stepper:common_stepper_submit_button_cluster',
    extraProps: {
      nodePools: stepper.form.nodePools,
      plan: stepper.form.plan,
      onSubmit: () => {
        stepper.confirm.step.lock();
        createNewCluster();
      },
    },
  },
];

export default stepsConfig;
