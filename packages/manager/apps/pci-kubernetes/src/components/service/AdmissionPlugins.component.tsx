import { useCallback } from 'react';
import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip, OsdsText, OsdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TKube } from '@/types';

export const plugins = [
  {
    name: 'NodeRestriction',
    label: 'Plugin Node Restriction',
    value: 'node',
    disabled: true,
  },
  {
    name: 'AlwaysPullImages',
    label: 'Plugin Always Pull Images',
    value: 'pull',
  },
];

const AdmissionPlugins = ({
  disabled,
  enabled,
}: TKube['customization']['apiServer']['admissionPlugins']) => {
  const { t } = useTranslation(['service']);

  const getChipContent = useCallback(
    (pluginName) => {
      if (enabled.includes(pluginName)) {
        return {
          label: t('kube_service_cluster_admission_plugins_activated'),
          color: ODS_THEME_COLOR_INTENT.success,
        };
      }
      if (disabled.includes(pluginName)) {
        return {
          label: t('kube_service_cluster_admission_plugins_desactivated'),
          color: ODS_THEME_COLOR_INTENT.warning,
        };
      }
      return null;
    },
    [disabled, enabled, t],
  );

  return (
    <div className="mb-4 flex flex-wrap justify-between gap-4">
      {plugins.map((plugin) => (
        <div
          className="flex w-full items-baseline justify-between "
          key={plugin.name}
        >
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_TEXT_COLOR_INTENT.text}
          >
            {plugin.label}
          </OsdsText>
          <OsdsChip
            color={getChipContent(plugin.name)?.color}
            data-testid={`admission-plugin-chip ${plugin.name}`}
          >
            {getChipContent(plugin.name)?.label}
          </OsdsChip>
        </div>
      ))}
      <OsdsLink
        color={ODS_THEME_COLOR_INTENT.primary}
        className="flex font-bold"
      >
        {t('kube_service_cluster_admission_plugins_mutation')}
      </OsdsLink>
    </div>
  );
};

export default AdmissionPlugins;
