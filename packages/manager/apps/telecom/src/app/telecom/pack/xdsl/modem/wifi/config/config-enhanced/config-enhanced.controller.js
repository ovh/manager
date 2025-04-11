export default /* @ngInject */ function XdslModemWifiConfigEnhancedCtrl(
  $scope,
  $q,
  $interval,
  $stateParams,
  $translate,
  wifiConfigEnhancedService,
  TucToast,
) {
  const self = this;
  self.loading = {
    mesh: true,
    onessid: true,
    radio: true,
    ssid: true,
  };

  self.updateTasks = {
    mesh: undefined,
    onessid: undefined,
  };

  self.radioSettings = [];
  self.ssidSettings = [];
  self.isMeshManaged = false;
  self.canUpdateOneSsid = true;
  self.mesh = false;
  self.onessid = false;

  self.$onInit = async function $onInit() {
    self.serviceName = $stateParams.serviceName;

    try {
      wifiConfigEnhancedService.getModemMesh(self.serviceName).then(
        (mesh) => {
          self.mesh = mesh;
          self.loading.mesh = false;
          self.isMeshManaged = true;
        },
        () => {
          self.isMeshManaged = false;
          self.loading.mesh = false;
        },
      );

      wifiConfigEnhancedService
        .getModemUseOnessid(self.serviceName)
        .then(async (onessid) => {
          self.onessid = onessid;
          self.loading.onessid = false;
          self.radioSettings = await wifiConfigEnhancedService.loadRadioSettings(
            self.serviceName,
          );
          self.loading.radio = false;
          self.loadSsidSettings(onessid);
        });
    } catch (err) {
      TucToast.error($translate.instant('xdsl_modem_wifi_read_error'));
    } finally {
      self.loader = false;
    }
  };

  self.$onDestroy = function() {
    self.clearAllModemUpdateTaskCheckInterval();
  };

  self.loadSsidSettings = (onessid) => {
    $q.when(
      wifiConfigEnhancedService.loadSsidSettings(
        self.serviceName,
        self.radioSettings,
        onessid,
      ),
    ).then((ssidSettings) => {
      self.ssidSettings = ssidSettings;
      self.loading.ssid = false;
    });
  };

  self.updateModemProperty = async (propertyName, updatedValue) => {
    const previousValue = self[propertyName];
    if (propertyName === 'onessid') {
      self.loading.ssid = true;
    }
    try {
      const updateTaskId = await wifiConfigEnhancedService.updateModemProperty(
        self.serviceName,
        propertyName,
        updatedValue,
      );
      self.updateTasks[propertyName] = $interval(async () => {
        const isDone = await wifiConfigEnhancedService.checkModemUpdateTask(
          this.serviceName,
          updateTaskId,
        );
        if (isDone) {
          if (propertyName === 'onessid') {
            self.loadSsidSettings(updatedValue);
          }
          self.clearModemUpdateTaskCheckInterval(propertyName);
        }
      }, 1000);
    } catch (error) {
      self.clearModemUpdateTaskCheckInterval(propertyName);
      $scope.$apply(() => {
        TucToast.error(
          $translate.instant('xdsl_modem_service_wifi_config_error'),
        );
        self[propertyName] = previousValue;
        self.loading.ssid = false;
      });
    }
  };

  self.clearModemUpdateTaskCheckInterval = function(propertyName) {
    $interval.cancel(self.updateTasks[propertyName]);
    self.updateTasks[propertyName] = undefined;
  };

  self.clearAllModemUpdateTaskCheckInterval = function() {
    Object.keys(self.updateTasks).forEach((propertyName) => {
      if (self.updateTasks[propertyName]) {
        self.clearModemUpdateTaskCheckInterval(propertyName);
      }
    });
  };

  self.onRadioSettingSubmit = async (radioSettingToSubmit) => {
    try {
      const updatedRadioSetting = await wifiConfigEnhancedService.submitUIRadioSetting(
        self.serviceName,
        radioSettingToSubmit,
      );
      self.updateRadioSettingsSingleItem(updatedRadioSetting);
    } catch (error) {
      $scope.$apply(() => {
        TucToast.error(
          $translate.instant('xdsl_modem_service_wifi_config_error'),
        );
      });
    }
  };

  self.updateRadioSettingsSingleItem = (updatedRadioSetting) => {
    $scope.$apply(() => {
      const updatedIdx = self.radioSettings.findIndex(
        (r) => r.radioName === updatedRadioSetting.radioName,
      );
      self.radioSettings.splice(updatedIdx, 1, updatedRadioSetting);
      self.radioSettings = [...self.radioSettings];
    });
  };

  self.onSsidSettingSubmit = async (ssidSettingToSubmit) => {
    try {
      const updatedSsidSetting = await wifiConfigEnhancedService.submitUISsidSetting(
        self.serviceName,
        ssidSettingToSubmit,
      );
      self.updateSsidSettingsSingleItem(updatedSsidSetting);
    } catch (error) {
      $scope.$apply(() => {
        TucToast.error(
          $translate.instant('xdsl_modem_service_wifi_config_error'),
        );
      });
    }
  };

  self.updateSsidSettingsSingleItem = (updatedSsidSetting) => {
    $scope.$apply(() => {
      const updatedIdx = self.ssidSettings.findIndex(
        (r) => r.wifiName === updatedSsidSetting.wifiName,
      );
      self.ssidSettings.splice(updatedIdx, 1, updatedSsidSetting);
      self.ssidSettings = [...self.ssidSettings];
    });
  };

  self.canUpdateMesh = !self.updateTasks.mesh && self.isMeshManaged;
}
