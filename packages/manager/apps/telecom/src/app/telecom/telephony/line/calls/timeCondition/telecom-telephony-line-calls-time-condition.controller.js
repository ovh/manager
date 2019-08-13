angular.module('managerApp').controller('TelecomTelephonyLineCallsTimeConditionCtrl', function (
  $q, $stateParams, $translate, $uibModal,
  OvhApiTelephony, TelephonyMediator, TucToast, uiCalendarConfig, tucTelephonyBulk,
  VoipTimeConditionCondition, voipTimeCondition, voipTimeConditionConfiguration,
) {
  const self = this;
  const bulkActionNames = {
    createCondition: 'createSrcCondition',
    deleteCondition: 'deleteSrcCondition',
    editCondition: 'editSrcCondition',
    options: 'options',
  };

  self.loading = {
    init: false,
  };

  self.line = null;
  self.helpCollapsed = true;
  self.availableTimeoutValues = null;
  self.slotList = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.hasChange = function () {
    const isConditionsInEdition = _.some(self.line.timeCondition.conditions, {
      inEdition: true,
    });

    return !isConditionsInEdition && self.line.timeCondition.hasChange();
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onTimeConditionFormSubmit = function () {
    self.line.timeCondition.status = 'SAVING';

    // first save options
    return self.line.timeCondition.save().then(() => {
      self.line.timeCondition.stopEdition().stopSlotsEdition(false, false, true).startEdition();

      // then save conditions
      return self.line.timeCondition.saveConditions().then(() => {
        TucToast.success($translate.instant('telephony_line_calls_time_condition_save_success'));
      });
    }, (error) => {
      self.line.timeCondition.stopEdition(true).startEdition();
      TucToast.error([$translate.instant('telephony_line_calls_time_condition_save_error'), _.get(error, 'data.message')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.line.timeCondition.status = 'OK';
    });
  };

  self.onTimeConditionFormReset = function () {
    // stop and restart the edition of time condition (stop also slots edition)
    self.line.timeCondition
      .stopEdition(true)
      .stopSlotsEdition(true, true)
      .stopConditionsEdition(true, true)
      .startEdition();

    // refresh the calendar...
    uiCalendarConfig.calendars.conditionsCalendar.fullCalendar('refetchEvents');
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /* ----------  Enums  ----------*/

  function getTimeoutEnum() {
    return TelephonyMediator.getApiModelEnum('telephony.TimeConditionsTimeoutEnum').then((values) => {
      self.availableTimeoutValues = _.chain(values).map((valueParam) => {
        const value = parseInt(valueParam, 10);
        return {
          value,
          label: $translate.instant('telephony_line_calls_time_condition_params_timeout_choice', {
            value,
          }),
        };
      }).sortBy('value').value();
    });
  }

  /* ----------  Controller initialization  ----------*/

  self.$onInit = function () {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount).then((group) => {
      self.line = group.getLine($stateParams.serviceName);

      return $q.all([
        self.line.getTimeCondition(),
        getTimeoutEnum(),
      ]).then(() => {
        self.line.timeCondition.startEdition();
        self.slotList = _.chunk(self.line.timeCondition.slots, 2);
      });
    }).catch((error) => {
      TucToast.error([$translate.instant('telephony_line_calls_time_condition_load_error'), _.get(error, 'data.message')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.init = false;
    });
  };

  /* -----  End of INITIALIZATION  ------*/

  /* ======================================
    =      EXPORT/IMPORT CONFIGURATION      =
    ======================================= */

  self.exportConfiguration = function () {
    if (self.line.timeCondition.conditions) {
      voipTimeConditionConfiguration.exportConfiguration(self.line.timeCondition.conditions);
    }
  };

  self.importConfiguration = function () {
    const modal = $uibModal.open({
      animation: true,
      templateUrl: 'app/telecom/telephony/service/time-condition/import/telecom-telephony-service-time-condition-import.html',
      controller: 'TelecomTelephonyServiceTimeConditionImportCtrl',
      controllerAs: 'TimeConditionImportCtrl',
    });

    modal.result.then((conditions) => {
      // Set existing condition state to delete
      _.forEach(self.line.timeCondition.conditions, (condition) => {
        _.set(condition, 'state', 'TO_DELETE');
      });

      return self.line.timeCondition.saveConditions().then(() => {
        self.line.timeCondition.conditions = self.line.timeCondition.conditions
          .concat(_.map(conditions, (condition) => {
            _.set(condition, 'billingAccount', $stateParams.billingAccount);
            _.set(condition, 'serviceName', $stateParams.serviceName);
            _.set(condition, 'state', 'TO_CREATE');

            _.set(condition, 'day', condition.weekDay);
            _.set(condition, 'hourBegin', condition.timeFrom.split(':').slice(0, 2).join(''));
            _.set(condition, 'hourEnd', condition.timeTo.split(':').slice(0, 2).join(''));

            _.set(condition, 'featureType', 'sip');
            return new VoipTimeConditionCondition(condition);
          }));

        uiCalendarConfig.calendars.conditionsCalendar.fullCalendar('refetchEvents');
        return self.line.timeCondition.saveConditions().then(() => {
          TucToast.success($translate.instant('telephony_common_time_condition_import_configuration_success'));
        }).catch(() => {
          TucToast.error($translate.instant('telephony_common_time_condition_import_configuration_error'));
        }).finally(() => {
          self.$onInit();
        });
      });
    }).catch((error) => {
      if (error) {
        TucToast.error($translate.instant('telephony_common_time_condition_import_configuration_error'));
      }
    });
  };

  /* ------ End of EXPORT/IMPORT CONFIGURATION ------ */

  /* ===========================
    =            BULK            =
    ============================ */

  self.filterServices = function (services) {
    const filteredServices = _.filter(services, service => !_.some(service.offers, _.method('includes', 'individual')));

    return _.filter(filteredServices, service => ['sip', 'mgcp'].indexOf(service.featureType) > -1);
  };

  self.bulkDatas = {
    conditions: (self.line && self.line.timeCondition) || [],
    infos: {
      name: 'timeCondition',
      actions: [
        {
          name: bulkActionNames.deleteCondition,
          route: '/telephony/{billingAccount}/timeCondition/{serviceName}/condition/{id}',
          method: 'DELETE',
          params: null,
        },
        {
          name: bulkActionNames.createCondition,
          route: '/telephony/{billingAccount}/timeCondition/{serviceName}/condition',
          method: 'POST',
          params: null,
        },
        {
          name: bulkActionNames.editCondition,
          route: '/telephony/{billingAccount}/timeCondition/{serviceName}/condition/{id}',
          method: 'PUT',
          params: null,
        },
        {
          name: bulkActionNames.options,
          route: '/telephony/{billingAccount}/timeCondition/{serviceName}/options',
          method: 'PUT',
          params: null,
        },
      ],
    },
  };

  self.getBulkParams = function (action) {
    const condition = self.line.timeCondition;

    switch (action) {
      case bulkActionNames.createCondition:
      case bulkActionNames.deleteCondition:
      case bulkActionNames.editCondition:
        return self.getTimeConditions(action);
      case bulkActionNames.options:
        return {
          slot1Number: condition.slots[1].number,
          slot1Type: condition.slots[1].type,
          slot2Number: condition.slots[2].number,
          slot2Type: condition.slots[2].type,
          slot3Number: condition.slots[3].number,
          slot3Type: condition.slots[3].type,
          status: condition.enable ? 'enabled' : 'disabled',
          timeout: condition.timeout,
          unavailableNumber: condition.slots[4].number,
          unavailableType: condition.slots[4].type,
        };
      default:
        return false;
    }
  };

  self.onBulkSuccess = function (bulkResult) {
    // display message of success or error
    tucTelephonyBulk.getTucToastInfos(bulkResult, {
      fullSuccess: $translate.instant('telephony_line_calls_time_condition_bulk_all_success'),
      partialSuccess: $translate.instant('telephony_line_calls_time_condition_bulk_some_success', {
        count: bulkResult.success.length,
      }),
      error: $translate.instant('telephony_line_calls_time_condition_bulk_error'),
    }).forEach((toastInfo) => {
      TucToast[toastInfo.type](toastInfo.message, {
        hideAfter: null,
      });
    });

    self.line.timeCondition
      .stopEdition()
      .stopSlotsEdition(false, false, true)
      .stopConditionsEdition(true, true)
      .startEdition();
    OvhApiTelephony.TimeCondition().resetCache();
    TelephonyMediator.resetAllCache();
  };

  self.onBulkError = function (error) {
    TucToast.error([$translate.instant('telephony_line_calls_time_condition_bulk_on_error'), _.get(error, 'msg.data')].join(' '));
  };

  self.getTimeConditions = function (action) {
    const conditions = _.filter(self.line.timeCondition.conditions, (condition) => {
      switch (action) {
        case bulkActionNames.createCondition:
          return condition.state === 'TO_CREATE';
        case bulkActionNames.deleteCondition:
          return condition.state === 'TO_DELETE';
        case bulkActionNames.editCondition:
          return condition.state === 'OK' && condition.hasChange(null, true);
        default:
          return false;
      }
    });

    return _.map(conditions, condition => ({
      id: condition.conditionId,
      day: condition.weekDay,
      hourBegin: voipTimeCondition.getSipTime(condition.timeFrom),
      hourEnd: voipTimeCondition.getSipTime(condition.timeTo, true),
      policy: condition.policy,
      status: condition.status,
    }));
  };

  /* -----  End of BULK  ------ */
});
