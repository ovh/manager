import { v6 } from '@ovh-ux/manager-core-api';
import { TKube } from '@/types';

export const pluginData = [
  {
    name: 'NodeRestriction',
    label: 'Plugin Node Restriction',
    value: 'node',
    disabled: true,
    tip: 'kube_service_cluster_admission_plugins_node_restriction_explanation',
    state: 'disabled',
  },
  {
    name: 'AlwaysPullImages',
    label: 'Plugin Always Pull Images',
    value: 'pull',
    tip: 'kube_service_cluster_admission_plugins_always_pull_image_explanation',
    state: 'disabled',
  },
];

export const updateAdmissionPlugin = ({
  projectId,
  kubeId,
  customization,
}: {
  projectId: string;
  kubeId: string;
  customization: TKube['customization'];
}) => {
  const url = `/cloud/project/${projectId}/kube/${kubeId}/customization`;
  return v6.put(url, customization);
};
