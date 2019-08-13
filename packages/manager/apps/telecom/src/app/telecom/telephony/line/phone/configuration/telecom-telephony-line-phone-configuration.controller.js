angular.module('managerApp').controller('TelecomTelephonyLinePhoneConfigurationCtrl', function ($scope, $q, $timeout, $state, $stateParams, $translate, TelephonyMediator, TucToast, TELEPHONY_LINE_PHONE_ADDITIONAL_INFOS) {
  const self = this;

  self.line = null;
  self.configGroups = null;
  self.allGroups = [];

  self.loading = {
    init: false,
    save: false,
    grouping: false,
  };
  self.model = {
    expertMode: false,
    manage: false,
    reboot: false,
  };
  self.hasExpertConfigs = false;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function groupConfigs() {
    const groupedConfigs = _.groupBy(self.line.phone.configurations, 'group');
    const additionalPhoneInfos = _.get(
      TELEPHONY_LINE_PHONE_ADDITIONAL_INFOS,
      self.line.phone.brand,
    );

    self.allGroups = [];

    angular.forEach(groupedConfigs, (configs, group) => {
      self.allGroups.push(angular.extend({
        name: group,
        configs: _.sortBy(configs, 'name'),
        isExpertOnly: _.every(configs, {
          level: 'expert',
        }),
      }, additionalPhoneInfos && _.has(additionalPhoneInfos, `additionalConfiguration.${group}`) ? _.get(additionalPhoneInfos, `additionalConfiguration.${group}`) : {}));
    });

    // first sort by group name and then set priority on general group (null) and proxy
    self.allGroups.sort((groupA, groupB) => {
      let nullResultA = groupA.name === 'null';
      let nullResultB = groupB.name === 'null';

      if (nullResultA) {
        return -1;
      } if (nullResultB) {
        return 1;
      }

      nullResultA = groupA.name === 'OutboundProxy';
      nullResultB = groupB.name === 'OutboundProxy';

      if (nullResultA) {
        return -1;
      } if (nullResultB) {
        return 1;
      }

      const translatedA = $translate.instant(`telephony_line_phone_configuration_group_${_.snakeCase(groupA.name)}`);
      const translatedB = $translate.instant(`telephony_line_phone_configuration_group_${_.snakeCase(groupB.name)}`);

      if (translatedA > translatedB) {
        return 1;
      } if (translatedA < translatedB) {
        return -1;
      }
      return 0;
    });
  }

  function refreshChunkedGroups() {
    const chunkSize = self.model.manage ? 1 : 2;

    if (!self.model.expertMode) {
      self.configGroups = _.chain(self.allGroups).filter({
        isExpertOnly: false,
      }).chunk(chunkSize).value();
    } else {
      self.configGroups = _.chunk(self.allGroups, chunkSize);
    }
  }

  function resetView() {
    groupConfigs();
    refreshChunkedGroups();
    self.model.reboot = false;
  }

  self.getModifiedConfigs = function () {
    return _.filter(
      self.line.phone.configurations,
      config => !_.isEqual(config.value, config.prevValue),
    );
  };

  self.getNonDefaultConfigs = function () {
    return _.filter(
      self.line.phone.configurations,
      config => !_.isEqual(config.value, config.default),
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            ACTIONS            =
    ============================== */

  self.onExpertModeChange = function () {
    self.loading.grouping = true;

    // use of timeout because display is bad when using ovh-form-flat selects
    $timeout(() => {
      refreshChunkedGroups();
      self.loading.grouping = false;
    });
  };

  self.onTextInputBlur = function (config) {
    if (_.isEmpty(config.value)) {
      _.set(config, 'value', config.prevValue);
    }
  };

  self.reinitValues = function () {
    angular.forEach(self.getModifiedConfigs(), (config) => {
      _.set(config, 'value', config.prevValue);
    });

    self.model.manage = !self.model.manage;
    refreshChunkedGroups();
    self.model.reboot = false;
  };

  self.defaultValues = function () {
    angular.forEach(self.getNonDefaultConfigs(), (config) => {
      _.set(config, 'value', config.default);
    });

    if (!self.model.expertMode && self.hasExpertConfigs) {
      TucToast.info($translate.instant('telephony_line_phone_configuration_default_info'));
    }
  };

  self.saveNewConfigurations = function () {
    let savePromise;
    let dynamicConfigs = [];

    self.loading.save = true;

    _.each(_.filter(self.allGroups, group => group.dynamicConfigs && _.isArray(group.dynamicConfigs) && group.dynamicConfigs.length > 0), (group) => { // eslint-disable-line
      dynamicConfigs = dynamicConfigs.concat(group.dynamicConfigs);
    });

    savePromise = self.line.phone
      .changePhoneConfiguration(null, !dynamicConfigs.length, dynamicConfigs.length
        ? false : self.model.reboot)
      .then(() => {
        if (dynamicConfigs.length) {
          savePromise = self.line.phone
            .changePhoneConfiguration(dynamicConfigs, true, self.model.reboot);
          return savePromise;
        }
        return null;
      });

    return savePromise.then(() => {
      self.model.manage = false;
      resetView();
      TucToast.success($translate.instant('telephony_line_phone_configuration_save_success'));
    }, (error) => {
      TucToast.error([$translate.instant('telephony_line_phone_configuration_save_error'), (error.data && error.data.message) || ''].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.save = false;
    });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount).then((group) => {
      self.line = group.getLine($stateParams.serviceName);

      return self.line.getPhone().then(() => {
        if (!self.line.hasPhone && !self.line.phone) {
          return $state.go('telecom.telephony.line.phone');
        }

        self.hasExpertConfigs = !_.every(self.line.phone.configurations, {
          level: null,
        });
        resetView();
        return null;
      }, (error) => {
        TucToast.error([$translate.instant('telephony_line_phone_configuration_load_error'), (error.data && error.data.message) || ''].join(' '));
        return $q.reject(error);
      });
    }, (error) => {
      TucToast.error([$translate.instant('telephony_line_phone_configuration_load_error'), (error.data && error.data.message) || ''].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.init = false;
    });
  }

  $scope.$on('$destroy', () => {
    if (self.model.manage) {
      self.reinitValues();
    }
  });

  /* -----  End of INITIALIZATION  ------*/

  init();
});
