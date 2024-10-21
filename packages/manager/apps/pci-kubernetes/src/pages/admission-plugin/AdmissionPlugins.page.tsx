import {
  OsdsSwitch,
  OsdsSwitchItem,
  OsdsButton,
  OsdsModal,
  OsdsTooltip,
  OsdsDivider,
  OsdsText,
  OsdsMessage,
  OsdsTooltipContent,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_SWITCH_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsSwitchChangedEventDetail,
  OsdsSwitchCustomEvent,
} from '@ovhcloud/ods-components';
import { useTranslation, Translation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { plugins } from '../../components/service/AdmissionPlugins.component';
import { useKubernetesCluster } from '@/api/hooks/useKubernetes';
import usePluginState from '@/hooks/usePluginState';

import { useUpdateAdmissionPlugin } from '@/api/hooks/useAdmissionPlugin/useAdmissionPlugin';
import { TAdmissionPlugin } from '@/types';
import { useResponsiveModal } from '@/hooks/useResizeOsdsModal';

const AdmissionPluginsModal = () => {
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const { projectId, kubeId } = useParams();
  const { data: kubeDetail, isPending } = useKubernetesCluster(
    projectId,
    kubeId,
  );
  const { t } = useTranslation(['service']);

  const {
    customization: {
      apiServer: { admissionPlugins },
    },
  } = kubeDetail ?? {
    customization: {
      apiServer: { admissionPlugins: { enabled: [], disabled: [] } },
    },
  };

  const [pluginData, setPluginData] = useState(admissionPlugins);
  const pluginState = usePluginState(pluginData.enabled, pluginData.disabled);
  useResponsiveModal('450px');
  const { addError, addSuccess } = useNotifications();

  const handleChange = useCallback(
    (e: OsdsSwitchCustomEvent<OdsSwitchChangedEventDetail>, name: string) => {
      const value = e.detail.current;

      setPluginData(
        (prevPluginData) =>
          Object.fromEntries(
            Object.entries(prevPluginData).map(([state, array]) => {
              if (!array.includes(name) && state === value) {
                return [state, [...array, name]];
              }
              if (array.includes(name) && state !== value) {
                return [state, array.filter((plugin) => plugin !== name)];
              }
              return [state, array];
            }),
          ) as TAdmissionPlugin,
      );
    },
    [],
  );

  const {
    updateAdmissionPlugins,
    isPending: isMutationUpdating,
  } = useUpdateAdmissionPlugin({
    projectId,
    kubeId,
    onError: (error) => {
      addError(
        <Translation ns="service">
          {(_t) =>
            _t('kube_service_cluster_admission_plugins_error', {
              message: error?.message || null,
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess: () => {
      addSuccess(
        <Translation ns="service">
          {(_t) => _t('kube_service_cluster_admission_plugins_success')}
        </Translation>,
        true,
      );
      onClose();
    },
  });

  const handleCancel = () => {
    setPluginData(admissionPlugins);
    onClose();
  };

  const handleSave = () => {
    updateAdmissionPlugins({
      ...kubeDetail.customization,
      apiServer: { admissionPlugins: pluginData },
    });
  };

  return (
    <OsdsModal
      dismissible
      headline={t('kube_service_cluster_admission_plugins_mutation')}
      onOdsModalClose={() => {
        onClose();
      }}
    >
      {isPending || isMutationUpdating ? (
        <div className="text-center my-10" data-testid="wrapper">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      ) : (
        <>
          <OsdsMessage type={ODS_MESSAGE_TYPE.info} className="my-6">
            {t('kube_service_cluster_admission_plugins_info_restrictions')}
            <br />

            {t(
              'kube_service_cluster_admission_plugins_info_restrictions_redeploy_after_change_admission',
            )}
          </OsdsMessage>
          <div className="my-10">
            {!isPending &&
              plugins.map((plugin, i) => (
                <div key={plugin.name} className="my-8 mx-4">
                  <div className="flex  my-3, justify-between">
                    <OsdsTooltip role="tooltip">
                      <OsdsText
                        className="mb-4"
                        size={ODS_TEXT_SIZE._400}
                        level={ODS_TEXT_LEVEL.body}
                        color={ODS_TEXT_COLOR_INTENT.text}
                      >
                        {plugin.name}
                      </OsdsText>
                      <OsdsTooltipContent slot="tooltip-content">
                        {t(plugin.tip)}
                      </OsdsTooltipContent>
                    </OsdsTooltip>
                    <OsdsSwitch
                      size={ODS_SWITCH_SIZE.sm}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      key={plugin.name}
                      onOdsSwitchChanged={(e) => {
                        if (!plugin.disabled) {
                          handleChange(e, plugin.name);
                        }
                      }}
                      disabled={plugin.disabled}
                    >
                      <OsdsSwitchItem
                        color="primary"
                        value="enabled"
                        // FIXME : fix this with ODS 18
                        checked={
                          pluginState(plugin.name) === 'enabled' || undefined
                        }
                      >
                        {t(
                          'kube_service_cluster_admission_plugins_to_activate',
                        )}
                      </OsdsSwitchItem>
                      {!plugin.disabled && (
                        <OsdsSwitchItem
                          color="primary"
                          value="disabled"
                          checked={
                            // FIXME : fix this with ODS 18
                            pluginState(plugin.name) === 'disabled' || undefined
                          }
                        >
                          {t(
                            'kube_service_cluster_admission_plugins_to_desactivate',
                          )}
                        </OsdsSwitchItem>
                      )}
                    </OsdsSwitch>
                  </div>
                  {i !== plugins.length - 1 && <OsdsDivider separator />}
                </div>
              ))}
          </div>
        </>
      )}
      <div className="flex space-x-5 justify-end">
        <OsdsButton
          slot="actions"
          inline
          disabled={isMutationUpdating || undefined}
          onClick={handleCancel}
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.stroked}
        >
          {t('common:common_stepper_cancel_button_label')}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          onClick={handleSave}
          disabled={isMutationUpdating || undefined}
          data-testid="confirm-btn"
        >
          {t('common:common_save_button_label')}
        </OsdsButton>
      </div>
    </OsdsModal>
  );
};

export default AdmissionPluginsModal;
