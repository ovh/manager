import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip, OsdsText, OsdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TKube } from '@/types';
import usePluginState from '@/hooks/usePluginState';

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

  const pluginsState = usePluginState(enabled, disabled);
  const navigate = useNavigate();

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
            color={
              pluginsState(plugin.name) === 'enabled'
                ? ODS_THEME_COLOR_INTENT.success
                : ODS_THEME_COLOR_INTENT.warning
            }
            data-testid={`admission-plugin-chip ${plugin.name}`}
          >
            {pluginsState(plugin.name) === 'enabled' &&
              t('kube_service_cluster_admission_plugins_activated')}
            {pluginsState(plugin.name) === 'disabled' &&
              t('kube_service_cluster_admission_plugins_desactivated')}
          </OsdsChip>
        </div>
      ))}
      <OsdsLink
        onClick={() => navigate('./admission-plugin')}
        color={ODS_THEME_COLOR_INTENT.primary}
        className="flex font-bold"
      >
        {t('kube_service_cluster_admission_plugins_mutation')}
      </OsdsLink>
    </div>
  );
};

export default AdmissionPlugins;
