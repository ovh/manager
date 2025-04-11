export default /* @ngInject */ function XdslModemWifiRadioSettingsCtrl(
  $translate,
) {
  const self = this;
  self.editableRadioSettings = [];

  self.$onChanges = ({ radioSettings }) => {
    if (radioSettings) {
      self.editableRadioSettings = self.radioSettings.map(
        (radioSettingsItem, idx) => {
          const existingEditableSettingsItem =
            self.editableRadioSettings.length >= idx + 1
              ? self.editableRadioSettings[idx]
              : undefined;

          const existingEditMode =
            existingEditableSettingsItem?.editMode !== undefined
              ? existingEditableSettingsItem.editMode
              : false;
          return {
            ...radioSettingsItem,
            editMode:
              radioSettingsItem?.editMode !== undefined
                ? radioSettingsItem.editMode
                : existingEditMode,
            tempValue:
              existingEditableSettingsItem?.tempValue !== undefined
                ? existingEditableSettingsItem.tempValue
                : {
                    enabled: radioSettingsItem.enabled,
                    channelMode: radioSettingsItem.channelMode,
                    channel: radioSettingsItem.channel,
                  },
          };
        },
      );
    }
  };

  self.availableChannelModes = [
    {
      id: 'Manual',
      name: $translate.instant(
        'xdsl_modem_service_wifi_radio_settings_channel_mode_manual',
      ),
    },
    {
      id: 'Auto',
      name: $translate.instant(
        'xdsl_modem_service_wifi_radio_settings_channel_mode_auto',
      ),
    },
  ];

  self.watchKey = function watchKey($event, radioSetting, valid) {
    if ($event.keyCode === 13 && valid) {
      self.submit(radioSetting);
    }
    if ($event.keyCode === 27) {
      self.cancel(radioSetting);
    }
  };

  self.getRadioStatusClass = (radio) => ({
    'text-success oui-icon-success-circle': radio.enabled,
    'text-danger oui-icon-error-circle': !radio.enabled,
  });

  self.activateEditMode = (radio) => {
    const updatedRadio = { ...radio, editMode: true };
    self.refreshRadioSettingsSingleItemDisplay(updatedRadio);
  };

  self.submit = async (radioSettingToSubmit) => {
    const updatedRadioSettings = {
      ...radioSettingToSubmit,
      editMode: false,
      enabled: radioSettingToSubmit.tempValue.enabled,
      channelMode: radioSettingToSubmit.tempValue.channelMode,
      channel: radioSettingToSubmit.tempValue.channel,
    };
    self.onSubmit({ radioSettingToSubmit: updatedRadioSettings });
  };

  self.cancel = (radioSettingsToRestore) => {
    const restoredRadioSettings = self.restoreUIRadioSetting(
      radioSettingsToRestore,
    );
    self.refreshRadioSettingsSingleItemDisplay(restoredRadioSettings);
  };

  self.restoreUIRadioSetting = (radioSetting) => {
    return {
      ...radioSetting,
      editMode: false,
      tempValue: {
        enabled: radioSetting.enabled,
        channelMode: radioSetting.channelMode,
        channel: radioSetting.channel,
      },
    };
  };

  self.refreshRadioSettingsSingleItemDisplay = (updatedRadioSetting) => {
    const updatedIdx = self.editableRadioSettings.findIndex(
      (r) => r.radioName === updatedRadioSetting.radioName,
    );
    self.editableRadioSettings.splice(updatedIdx, 1, updatedRadioSetting);
  };
}
