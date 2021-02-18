import chunk from 'lodash/chunk';
import forEach from 'lodash/forEach';
import every from 'lodash/every';
import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import has from 'lodash/has';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';
import sortBy from 'lodash/sortBy';

import { TELEPHONY_LINE_PHONE_ADDITIONAL_INFOS } from '../phone.constant';

export default /* @ngInject */ function TelecomTelephonyLinePhoneConfigurationCtrl(
  $scope,
  $q,
  $timeout,
  $state,
  $stateParams,
  $translate,
  TelephonyMediator,
  TucToast,
) {
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
    const groupedConfigs = groupBy(self.line.phone.configurations, 'group');
    const additionalPhoneInfos = get(
      TELEPHONY_LINE_PHONE_ADDITIONAL_INFOS,
      self.line.phone.brand,
    );

    self.allGroups = [];

    angular.forEach(groupedConfigs, (configs, group) => {
      self.allGroups.push(
        angular.extend(
          {
            name: group,
            configs: sortBy(configs, 'name'),
            isExpertOnly: every(configs, {
              level: 'expert',
            }),
          },
          additionalPhoneInfos &&
            has(additionalPhoneInfos, `additionalConfiguration.${group}`)
            ? get(additionalPhoneInfos, `additionalConfiguration.${group}`)
            : {},
        ),
      );
    });

    // first sort by group name and then set priority on general group (null) and proxy
    self.allGroups.sort((groupA, groupB) => {
      let nullResultA = groupA.name === 'null';
      let nullResultB = groupB.name === 'null';

      if (nullResultA) {
        return -1;
      }
      if (nullResultB) {
        return 1;
      }

      nullResultA = groupA.name === 'OutboundProxy';
      nullResultB = groupB.name === 'OutboundProxy';

      if (nullResultA) {
        return -1;
      }
      if (nullResultB) {
        return 1;
      }

      const translatedA = $translate.instant(
        `telephony_line_phone_configuration_group_${snakeCase(groupA.name)}`,
      );
      const translatedB = $translate.instant(
        `telephony_line_phone_configuration_group_${snakeCase(groupB.name)}`,
      );

      if (translatedA > translatedB) {
        return 1;
      }
      if (translatedA < translatedB) {
        return -1;
      }
      return 0;
    });
  }

  function refreshChunkedGroups() {
    const chunkSize = self.model.manage ? 1 : 2;

    if (!self.model.expertMode) {
      self.configGroups = chunk(
        filter(self.allGroups, {
          isExpertOnly: false,
        }),
        chunkSize,
      );
    } else {
      self.configGroups = chunk(self.allGroups, chunkSize);
    }
  }

  function resetView() {
    groupConfigs();
    refreshChunkedGroups();
    self.model.reboot = false;
  }

  self.getModifiedConfigs = function getModifiedConfigs() {
    return filter(
      self.line.phone.configurations,
      (config) => !isEqual(config.value, config.prevValue),
    );
  };

  self.getNonDefaultConfigs = function getNonDefaultConfigs() {
    return filter(
      self.line.phone.configurations,
      (config) => !isEqual(config.value, config.default),
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            ACTIONS            =
    ============================== */

  self.onExpertModeChange = function onExpertModeChange() {
    self.loading.grouping = true;

    // use of timeout because display is bad when using ovh-form-flat selects
    $timeout(() => {
      refreshChunkedGroups();
      self.loading.grouping = false;
    });
  };

  self.onTextInputBlur = function onTextInputBlur(config) {
    if (isEmpty(config.value)) {
      set(config, 'value', config.prevValue);
    }
  };

  self.reinitValues = function reinitValues() {
    angular.forEach(self.getModifiedConfigs(), (config) => {
      set(config, 'value', config.prevValue);
    });

    self.model.manage = !self.model.manage;
    refreshChunkedGroups();
    self.model.reboot = false;
  };

  self.defaultValues = function defaultValues() {
    angular.forEach(self.getNonDefaultConfigs(), (config) => {
      set(config, 'value', config.default);
    });

    if (!self.model.expertMode && self.hasExpertConfigs) {
      TucToast.info(
        $translate.instant('telephony_line_phone_configuration_default_info'),
      );
    }
  };

  self.saveNewConfigurations = function saveNewConfigurations() {
    let savePromise;
    let dynamicConfigs = [];

    self.loading.save = true;

    forEach(
      filter(
        self.allGroups,
        (group) =>
          group.dynamicConfigs &&
          isArray(group.dynamicConfigs) &&
          group.dynamicConfigs.length > 0,
      ),
      (group) => {
        dynamicConfigs = dynamicConfigs.concat(group.dynamicConfigs);
      },
    );

    savePromise = self.line.phone
      .changePhoneConfiguration(
        null,
        !dynamicConfigs.length,
        dynamicConfigs.length ? false : self.model.reboot,
      )
      .then(() => {
        if (dynamicConfigs.length) {
          savePromise = self.line.phone.changePhoneConfiguration(
            dynamicConfigs,
            true,
            self.model.reboot,
          );
          return savePromise;
        }
        return null;
      });

    return savePromise
      .then(
        () => {
          self.model.manage = false;
          resetView();
          TucToast.success(
            $translate.instant(
              'telephony_line_phone_configuration_save_success',
            ),
          );
        },
        (error) => {
          TucToast.error(
            [
              $translate.instant(
                'telephony_line_phone_configuration_save_error',
              ),
              (error.data && error.data.message) || '',
            ].join(' '),
          );
          return $q.reject(error);
        },
      )
      .finally(() => {
        self.loading.save = false;
      });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then(
        (group) => {
          self.line = group.getLine($stateParams.serviceName);

          return self.line.getPhone().then(
            () => {
              if (!self.line.hasPhone && !self.line.phone) {
                return $state.go('telecom.telephony.billingAccount.line.phone');
              }

              self.hasExpertConfigs = !every(self.line.phone.configurations, {
                level: null,
              });
              resetView();
              return null;
            },
            (error) => {
              TucToast.error(
                [
                  $translate.instant(
                    'telephony_line_phone_configuration_load_error',
                  ),
                  (error.data && error.data.message) || '',
                ].join(' '),
              );
              return $q.reject(error);
            },
          );
        },
        (error) => {
          TucToast.error(
            [
              $translate.instant(
                'telephony_line_phone_configuration_load_error',
              ),
              (error.data && error.data.message) || '',
            ].join(' '),
          );
          return $q.reject(error);
        },
      )
      .finally(() => {
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
}
