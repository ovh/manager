const ACTIVATION_STATUS_ENABLED = 'enabled';
const ACTIVATION_STATUS_DISABLED = 'disabled';
const DEFAULT_RADIO_FREQUENCY = '2.4GHz';

function activationToBoolean(activationState) {
  return ACTIVATION_STATUS_ENABLED === activationState;
}

function booleanToActivation(booleanValue) {
  return booleanValue ? ACTIVATION_STATUS_ENABLED : ACTIVATION_STATUS_DISABLED;
}

export default class XdslModemWifiConfigEnhancedService {
  constructor($q, $http, $translate, OvhApiXdsl) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.OvhApiXdsl = OvhApiXdsl;
  }

  async getModemMesh(serviceName) {
    const { data } = await this.$http.get(`/xdsl/${serviceName}/modem/mesh`);
    return activationToBoolean(data);
  }

  async getModemUseOnessid(serviceName) {
    const { data } = await this.$http.get(`/xdsl/${serviceName}/modem/onessid`);
    return activationToBoolean(data);
  }

  async updateModemProperty(serviceName, propertyName, updatedValue) {
    const bodyPropertyNameMap = {
      mesh: 'wifiMesh',
      onessid: 'wifiOneSsid',
    };

    const bodyPropertyName = bodyPropertyNameMap[propertyName];
    if (bodyPropertyName) {
      const response = await this.$http.put(
        `/xdsl/${serviceName}/modem/${propertyName}`,
        {
          [bodyPropertyName]: booleanToActivation(updatedValue),
        },
      );

      return response?.data?.id;
    }
    throw new Error(`invalid modem property name: ${propertyName}`);
  }

  checkModemUpdateTask(serviceName, taskId) {
    return this.OvhApiXdsl.v6()
      .getTask({
        xdslId: serviceName,
        taskId,
      })
      .$promise.then(
        (response) => {
          return response?.data?.status === 'done';
        },
        (error) => {
          if (error.status === 404) {
            return true;
          }
          throw new Error('An error occured when requesting modem update task');
        },
      );
  }

  async loadRadioSettings(serviceName) {
    const { data } = await this.$http.get(
      `/xdsl/${serviceName}/modem/wifiRadio`,
    );
    return this.$q.all(
      data.map((radioName) =>
        this.loadRadioSettingsDetails(serviceName, radioName),
      ),
    );
  }

  async loadRadioSettingsDetails(serviceName, radioName) {
    const { data } = await this.$http.get(
      `/xdsl/${serviceName}/modem/wifiRadio/${radioName}`,
    );
    return data;
  }

  async submitUIRadioSetting(serviceName, radioSetting) {
    await this.$http.put(
      `/xdsl/${serviceName}/modem/wifiRadio/${radioSetting.radioName}`,
      {
        enabled: radioSetting.enabled,
        channelMode: radioSetting.channelMode,
        channel: radioSetting.channel,
      },
    );

    return radioSetting;
  }

  async loadSsidSettings(serviceName, availableRadioSettings, useOnessid) {
    // TODO replace the dummy http call with the commented call
    const defaultRadioSettings = availableRadioSettings.find(
      (radioSetting) => radioSetting.frequency === DEFAULT_RADIO_FREQUENCY,
    );
    const otherRadioSettings = availableRadioSettings.find(
      (radioSetting) => radioSetting.frequency !== DEFAULT_RADIO_FREQUENCY,
    );

    /*
    const involvedRadioSettings = useOnessid ? [defaultRadioSettings, otherRadioSettings] : [defaultRadioSettings];
    const ssidSettings =  await Promise.all(
      involvedRadioSettings.map(async ({radioName, frequency}) => {
        const { data } = await this.$http.get(`/xdsl/${serviceName}/modem/wifiRadio/${radioName}/ssid`);
        return Promise.all(data.map(async (wifiName) => {
          const loadedSettings = this.$http.get(`/xdsl/${serviceName}/modem/wifiRadio/${radioName}/ssid/${wifiName}`);
          return {
            ...loadedSettings.data,
            radioName
            frequency: useOnessid ? this.$translate.instant('xdsl_modem_service_wifi_ssid_settings_all_frequencies') : frequency
          }
        }));
      }));
    return ssidSettings.flat(1);
    */

    await this.$http.get(`/xdsl/${serviceName}/modem`);
    const setting1 = {
      wifiName: 'A001',
      SSID: 'my wifi',
      enabled: true,
      guest: true,
      isolate: true,
      advertise: true,
      securityMode: 'WPA2AndWPA3',
      securityKey: 'ay213',
      supportedSecurityMode: 'WPA2, WPA2AndWPA3, WPA3',
      radioName: defaultRadioSettings.radioName,
      frequency: useOnessid
        ? this.$translate.instant(
            'xdsl_modem_service_wifi_ssid_settings_all_frequencies',
          )
        : defaultRadioSettings.frequency,
    };
    const setting2 = {
      wifiName: 'A002',
      SSID: 'my other wifi',
      enabled: false,
      guest: false,
      isolate: false,
      advertise: false,
      securityMode: 'WPA2',
      securityKey: 'xy213',
      supportedSecurityMode: 'WPA2',
      radioName: otherRadioSettings.radioName,
      frequency: otherRadioSettings.frequency,
    };
    return useOnessid ? [setting1] : [setting1, setting2];
  }

  async submitUISsidSetting(serviceName, updatedSsidSettings) {
    await this.$http.put(
      `/xdsl/${serviceName}/modem/wifiRadio/${updatedSsidSettings.radioName}/ssid/${updatedSsidSettings.wifiName}`,
      {
        SSID: updatedSsidSettings.SSID,
        enabled: updatedSsidSettings.enabled,
        securityMode: updatedSsidSettings.securityMode,
      },
    );

    return updatedSsidSettings;
  }
}
