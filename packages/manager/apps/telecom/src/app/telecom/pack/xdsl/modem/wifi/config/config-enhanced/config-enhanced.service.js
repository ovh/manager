const ACTIVATION_STATUS_ENABLED = 'enabled';
const ACTIVATION_STATUS_DISABLED = 'disabled';
const DEFAULT_RADIO_FREQUENCY = '2.4GHz';

/*
function activationToBoolean(activationState) {
  return ACTIVATION_STATUS_ENABLED === activationState ? true : false;
}
*/

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
    // TODO replace the dummy http call with the commented call
    /*
      const activationValue = await this.$http.get(`/xdsl/${serviceName}/modem/mesh`);
      return activationToBoolean(activationValue);
    */
    await this.$http.get(`/xdsl/${serviceName}/modem`);
    return false;
  }

  async getModemUseOnessid(serviceName) {
    // TODO replace the dummy http call with the commented call
    /*
      const activationValue = await this.$http.get(`/xdsl/${serviceName}/modem/onessid`);
      return activationToBoolean(activationValue);
    */
    await this.$http.get(`/xdsl/${serviceName}/modem`);
    return false;
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

      return response?.data?.taskId;
    }
    throw new Error(`invalid modem property name: ${propertyName}`);
  }

  async checkModemUpdateTask(serviceName, taskId) {
    const response = await this.OvhApiXdsl.v6().getTask({
      xdslId: serviceName,
      taskId,
    }).$promise;
    return response?.data?.status === 'done';
  }

  async loadRadioSettings(serviceName) {
    // TODO replace the dummy http call with the commented call
    /*
        const radioNames = await this.$http.get(`/xdsl/${serviceName}/modem/wifiRadio`);
        radioSettings = await this.$q.all(radioNames.map(radioName => 
            this.$http.get(`/xdsl/${serviceName}/modem/wifiRadio/${radioName}`)
        ));
        */
    await this.$http.get(`/xdsl/${serviceName}/modem`);
    const loadedRadioSettings = [
      {
        radioName: '001',
        frequency: '2.4GHz',
        enabled: true,
        maxBitRate: 576,
        channel: 6,
        channelMode: 'Manual',
        channelBandwidth: '40Mhz',
        transmitPower: 100,
        standards: 'b,g,n,ax',
        supportedChannels: '1,2,3,4,5,6,7,8,9,10,11,12,13',
        supportedPowers: 'string',
        supportedStandards: 'string',
      },
      {
        radioName: '002',
        frequency: '5GHz',
        enabled: false,
        maxBitRate: 1200,
        channel: 36,
        channelMode: 'Auto',
        channelBandwidth: '80Mhz',
        transmitPower: 100,
        standards: 'a,n,ac,ax',
        supportedChannels: '36,40,44,48,52,60,64,100,104,10,112',
        supportedPowers: 'string',
        supportedStandards: 'string',
      },
    ];
    return loadedRadioSettings.map((radio) => ({
      ...radio,
      supportedChannels: radio.supportedChannels
        .split(',')
        .map((channel) => parseInt(channel, 10)),
    }));
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
    // async loadSsidSettings(serviceName, availableRadioSettings, useOnessid) {
    const defaultRadioSettings = availableRadioSettings.find(
      (radioSetting) => radioSetting.frequency === DEFAULT_RADIO_FREQUENCY,
    );
    const otherRadioSettings = availableRadioSettings.find(
      (radioSetting) => radioSetting.frequency !== DEFAULT_RADIO_FREQUENCY,
    );

    /*
    const radioSettingsToRequest = useOnessid ? [defaultRadioSettings, otherRadioSettings] : [defaultRadioSettings];
    const ssidSettings =  await Promise.all(
      radioSettingsToRequest.map(async ({radioName, frequency}) => {
        const wifiNames = await this.$http.get(`/xdsl/${serviceName}/modem/wifiRadio/${radioName}/ssid`);
        return Promise.all(wifiNames.map(async (wifiName) => {
          const loadedSettings = this.$http.get(`/xdsl/${serviceName}/modem/wifiRadio/${radioName}/ssid/${wifiName}`);
          return {
            ...loadedSettings,
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
