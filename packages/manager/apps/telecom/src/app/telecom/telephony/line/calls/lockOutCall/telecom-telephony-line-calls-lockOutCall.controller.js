angular.module('managerApp').controller(
  'TelecomTelephonyLineCallsLockOutCallCtrl',
  function (
    $stateParams,
    $translate,
    TucToast,
    TucToastError,
    OvhApiTelephony,
    tucTelephonyBulk,
  ) {
    const self = this;

    self.isPin = function (val) {
      return /^\d{4}$/.test(val) || !self.options.lockOutCall;
    };

    self.needSave = function () {
      return (self.options.lockOutCallPassword + self.options.lockOutCall)
        !== (self.saved.lockOutCallPassword + self.saved.lockOutCall);
    };

    self.cancel = function () {
      self.options = angular.copy(self.saved);
    };

    self.save = function () {
      self.loading.save = true;
      OvhApiTelephony.Line().Options().v6().update(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        self.options,
      ).$promise.then(
        () => {
          self.saved = angular.copy(self.options);
          TucToast.success($translate.instant('telephony_line_actions_line_calls_out_lock_call_save_success'));
        },
        () => new TucToastError($translate.instant('telephony_line_actions_line_calls_out_lock_call_save_error')),
      ).finally(() => {
        self.loading.save = false;
      });
    };

    function init() {
      self.loading = {
        init: true,
      };
      self.options = {
        lockOutCallPassword: null,
        lockOutCall: null,
      };
      self.saved = angular.copy(self.options);
      OvhApiTelephony.Line().Options().v6().get({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise.then(
        (options) => {
          self.options = _.pick(options, ['lockOutCallPassword', 'lockOutCall']);
          self.saved = angular.copy(self.options);
        },
        () => new TucToastError($translate.instant('telephony_line_actions_line_calls_out_lock_call_load_error')),
      ).finally(() => {
        self.loading.init = false;
      });
    }

    init();

    self.bulkDatas = {
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
      infos: {
        name: 'lockOutCall',
        actions: [{
          name: 'options',
          route: '/telephony/{billingAccount}/line/{serviceName}/options',
          method: 'PUT',
          params: null,
        }],
      },
    };

    self.getBulkParams = function () {
      return {
        lockOutCall: self.options.lockOutCall,
        lockOutCallPassword: self.options.lockOutCallPassword,
      };
    };

    self.onBulkSuccess = function (bulkResult) {
      // display message of success or error
      tucTelephonyBulk.getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant('telephony_line_actions_line_calls_out_lock_call_bulk_all_success'),
        partialSuccess: $translate.instant('telephony_line_actions_line_calls_out_lock_call_bulk_some_success', {
          count: bulkResult.success.length,
        }),
        error: $translate.instant('telephony_line_actions_line_calls_out_lock_call_bulk_error'),
      }).forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

      OvhApiTelephony.Line().v6().resetAllCache();
      self.save();
    };

    self.onBulkError = function (error) {
      TucToast.error([$translate.instant('telephony_line_actions_line_calls_out_lock_call_bulk_on_error'), _.get(error, 'msg.data')].join(' '));
    };
  },
);
