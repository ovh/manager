export default /* @ngInject */ function XdslModemWifiSsidSettingsCtrl(
  $translate,
) {
  const self = this;
  self.editableSsidSettings = [];

  self.$onChanges = ({ ssidSettings }) => {
    if (ssidSettings) {
      self.editableSsidSettings = self.ssidSettings.map(
        (ssidSettingsItem, idx) => {
          const existingEditableSettingsItem =
            self.editableSsidSettings.length >= idx + 1
              ? self.editableSsidSettings[idx]
              : undefined;

          const existingEditMode =
            existingEditableSettingsItem?.editMode !== undefined
              ? existingEditableSettingsItem.editMode
              : false;
          return {
            ...ssidSettingsItem,
            supportedSecurityMode: ssidSettingsItem.supportedSecurityMode
              .split(', ')
              .map((availablesecurityMode) => ({
                id: availablesecurityMode,
                name: $translate.instant(
                  `xdsl_modem_service_wifi_ssid_settings_security_mode_${availablesecurityMode}`,
                ),
              })),
            editMode:
              ssidSettingsItem?.editMode !== undefined
                ? ssidSettingsItem.editMode
                : existingEditMode,
            tempValue:
              existingEditableSettingsItem?.tempValue !== undefined
                ? existingEditableSettingsItem.tempValue
                : {
                    enabled: ssidSettingsItem.enabled,
                    securityMode: ssidSettingsItem.securityMode,
                    SSID: ssidSettingsItem.SSID,
                  },
          };
        },
      );
    }
  };

  self.watchKey = function watchKey($event, settingsItem, valid) {
    if ($event.keyCode === 13 && valid) {
      self.submit(settingsItem);
    }
    if ($event.keyCode === 27) {
      self.cancel(settingsItem);
    }
  };

  self.getActivationClass = (activationState) => ({
    'text-success oui-icon-success-circle': activationState,
    'text-danger oui-icon-error-circle': !activationState,
  });

  self.getSecurityModeLabel = (settingsItem) =>
    $translate.instant(
      `xdsl_modem_service_wifi_ssid_settings_security_mode_${settingsItem.securityMode}`,
    );

  self.activateEditMode = (settingsItem) => {
    const updatedSettingsItem = { ...settingsItem, editMode: true };
    self.refreshSsidSettingsSingleItemDisplay(updatedSettingsItem);
  };

  self.submit = async (settingsItemToSubmit) => {
    const updatedSsidSettings = {
      ...settingsItemToSubmit,
      editMode: false,
      SSID: settingsItemToSubmit.tempValue.SSID,
      enabled: settingsItemToSubmit.tempValue.enabled,
      securityMode: settingsItemToSubmit.tempValue.securityMode,
    };
    self.onSubmit({ ssidSettingToSubmit: updatedSsidSettings });
  };

  self.cancel = (settingsItemToRestore) => {
    const restoredSsidSettings = self.restoreUISsidSetting(
      settingsItemToRestore,
    );
    self.refreshSsidSettingsSingleItemDisplay(restoredSsidSettings);
  };

  self.restoreUISsidSetting = (ssidSetting) => {
    return {
      ...ssidSetting,
      editMode: false,
      tempValue: {
        enabled: ssidSetting.enabled,
        securityMode: ssidSetting.securityMode,
        SSID: ssidSetting.SSID,
      },
    };
  };

  self.refreshSsidSettingsSingleItemDisplay = (updatedSsidSetting) => {
    const updatedIdx = self.editableSsidSettings.findIndex(
      (r) => r.wifiName === updatedSsidSetting.wifiName,
    );
    self.editableSsidSettings.splice(updatedIdx, 1, updatedSsidSetting);
  };
}
