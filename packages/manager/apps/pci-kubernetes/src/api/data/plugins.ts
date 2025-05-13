import { v6 } from '@ovh-ux/manager-core-api';
import { TAdmissionPlugin, TKube } from '@/types';

type PluginsData = {
  name: string;
  label: string;
  value?: string;
  disabled?: boolean;
  tip?: string;
  state: string;
};

export const pluginData: PluginsData[] = [
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

/**
 * Checks if a plugin already exists in the plugin data.
 * @param name - The name of the plugin to check.
 * @returns - The plugin object if it exists, otherwise undefined.
 */
export const pluginAlreadyExists = (name: string): PluginsData | undefined =>
  pluginData.find((plugin) => name === plugin.name);

/**
 * Maps an array of admission plugins to an object with additional properties.
 * @param admissionPlugins - The admission, enabled, and disabled plugins object.
 * @returns - An array of plugin objects, each with name, label, state, tip, value, and disabled properties, sorted alphabetically by label
 */
export const mapPluginsFromArrayToObject = (
  admissionPlugins: TAdmissionPlugin,
): PluginsData[] =>
  Object.entries(admissionPlugins)
    .flatMap(([state, names]) =>
      names.map((name) => {
        const existingPlugin = pluginAlreadyExists(name);
        return {
          name,
          label: existingPlugin?.label || name,
          state,
          tip: existingPlugin?.tip || null,
          value: existingPlugin?.value || name,
          disabled: existingPlugin?.disabled ?? false,
        };
      }),
    )
    .sort((a, b) => a.label.localeCompare(b.label));
