import {
  OsdsSwitch,
  OsdsSwitchItem,
  OsdsButton,
  OsdsModal,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { plugins } from './AdmissionPlugins.component';

const AdmissionPluginsModal = (props = { node: false, pull: false }) => {
  const { t } = useTranslation(['service']);
  return (
    <OsdsModal
      headline={t('kube_service_cluster_admission_plugins_mutation')}
      onOdsModalClose={() => {}}
    >
      AdmissionPluginsModal Infobulle
      {plugins.map((plugin) => (
        <OsdsSwitch key={plugin.name}>
          <OsdsSwitchItem
            color="primary"
            value="true"
            // TODO : fix this with ODS 18
            checked={props[plugin.value] || undefined}
          >
            {t('kube_service_cluster_admission_plugins_to_activate')}
          </OsdsSwitchItem>
          <OsdsSwitchItem
            color="primary"
            value="false"
            checked={
              // TODO : fix this with ODS 18
              props[plugin.value] === false ? props[plugin.value] : undefined
            }
          >
            {t('kube_service_cluster_admission_plugins_to_activate')}
          </OsdsSwitchItem>
        </OsdsSwitch>
      ))}
      <div className="flex space-x-5">
        <OsdsButton
          slot="actions"
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          onClick={() => {}}
          data-testid="confirm-btn"
        >
          {t('save')}
        </OsdsButton>

        <OsdsButton
          slot="actions"
          inline
          onClick={() => {}}
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.stroked}
        >
          {t('cancel')}
        </OsdsButton>
      </div>
    </OsdsModal>
  );
};

export default AdmissionPluginsModal;
