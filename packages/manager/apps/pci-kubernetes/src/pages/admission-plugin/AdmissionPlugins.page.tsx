import {
  OsdsSwitch,
  OsdsSwitchItem,
  OsdsButton,
  OsdsModal,
  OsdsPopoverContent,
  OsdsDivider,
  OsdsText,
  OsdsMessage,
  OsdsPopover,
  OsdsSpinner,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_SWITCH_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsSwitchChangedEventDetail,
  OsdsSwitchCustomEvent,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useKubernetesCluster } from '@/api/hooks/useKubernetes';
import { useUpdateAdmissionPlugin } from '@/api/hooks/useAdmissionPlugin/useAdmissionPlugin';
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

  const { plugins } = kubeDetail ?? {};

  const [pluginData, setPluginData] = useState(plugins);

  useResponsiveModal('450px');
  const { addError, addSuccess } = useNotifications();

  const handleChange = useCallback(
    (e: OsdsSwitchCustomEvent<OdsSwitchChangedEventDetail>, name: string) => {
      const state = e.detail.current;

      setPluginData((prevPluginData) =>
        prevPluginData.map((plugin) => {
          if (plugin.name === name) {
            return { ...plugin, state };
          }
          return plugin;
        }),
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
        t('kube_service_cluster_admission_plugins_error', {
          message: error?.message || null,
        }),
        true,
      );
      onClose();
    },
    onSuccess: () => {
      addSuccess(t('kube_service_cluster_admission_plugins_success'), true);
      onClose();
    },
  });

  const handleCancel = () => {
    setPluginData(plugins);
    onClose();
  };

  const handleSave = () => {
    const initialState = { enabled: [], disabled: [] };

    const reorderPlugin = pluginData.reduce((acc, item) => {
      acc[item.state] = [...acc[item.state], item.name];
      return acc;
    }, initialState);

    updateAdmissionPlugins({
      ...kubeDetail.customization,
      apiServer: { admissionPlugins: reorderPlugin },
    });
  };

  return (
    <OsdsModal
      dismissible
      headline={t('kube_service_cluster_admission_plugins_mutation')}
      onOdsModalClose={onClose}
    >
      {isPending || isMutationUpdating ? (
        <div className="text-center my-10" data-testid="wrapper">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      ) : (
        <>
          <OsdsMessage type={ODS_MESSAGE_TYPE.info} className="my-6">
            {t('kube_service_cluster_admission_plugins_info_restrictions')}
          </OsdsMessage>
          <OsdsMessage type={ODS_MESSAGE_TYPE.info} className="my-6">
            {t(
              'kube_service_cluster_admission_plugins_info_restrictions_redeploy_after_change_admission',
            )}
          </OsdsMessage>
          <div className="my-10">
            {!isPending &&
              pluginData?.map((plugin, index) => (
                <div key={plugin.name} className="my-8 mx-4">
                  <div className="flex  my-3, justify-between">
                    <OsdsPopover>
                      <span slot="popover-trigger">
                        <OsdsText
                          className="mb-4"
                          size={ODS_TEXT_SIZE._400}
                          level={ODS_TEXT_LEVEL.body}
                          color={ODS_TEXT_COLOR_INTENT.text}
                        >
                          {plugin.name}
                        </OsdsText>
                        {plugin.tip && (
                          <OsdsIcon
                            name={ODS_ICON_NAME.HELP}
                            size={ODS_ICON_SIZE.xs}
                            className="ml-4 cursor-help"
                            color={ODS_THEME_COLOR_INTENT.primary}
                          />
                        )}
                      </span>
                      {plugin.tip && (
                        <>
                          <OsdsPopoverContent>
                            <OsdsText
                              color={ODS_THEME_COLOR_INTENT.text}
                              level={ODS_TEXT_LEVEL.body}
                            >
                              {t(plugin.tip)}
                            </OsdsText>
                          </OsdsPopoverContent>
                        </>
                      )}
                    </OsdsPopover>
                    <OsdsSwitch
                      size={ODS_SWITCH_SIZE.sm}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      key={plugin.name}
                      onOdsSwitchChanged={(e) => {
                        if (!plugin.disabled) {
                          handleChange(e, plugin.name);
                        }
                      }}
                      disabled={plugin.disabled || undefined}
                    >
                      <OsdsSwitchItem
                        color="primary"
                        value="enabled"
                        checked={plugin.state === 'enabled' || undefined}
                      >
                        {t(
                          'kube_service_cluster_admission_plugins_to_activate',
                        )}
                      </OsdsSwitchItem>
                      {!plugin.disabled && (
                        <OsdsSwitchItem
                          color="primary"
                          value="disabled"
                          checked={plugin.state === 'disabled' || undefined}
                        >
                          {t(
                            'kube_service_cluster_admission_plugins_to_desactivate',
                          )}
                        </OsdsSwitchItem>
                      )}
                    </OsdsSwitch>
                  </div>
                  {index !== plugins.length - 1 && <OsdsDivider separator />}
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
