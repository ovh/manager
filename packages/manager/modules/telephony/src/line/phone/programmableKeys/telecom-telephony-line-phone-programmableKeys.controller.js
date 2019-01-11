angular.module('managerApp').controller('TelecomTelephonyLinePhoneProgammableKeysCtrl', function ($translate, TelephonyMediator, $stateParams, $uibModal, TucToast, OvhApiTelephony, tucTelephonyBulk, tucVoipLinePhoneFunction) {
  const self = this;

  self.loading = {
    init: false,
    keys: false,
  };
  self.hasPhone = false;
  self.order = {
    by: 'keyNum',
    desc: false,
  };

  self.functionKeys = {
    raw: null,
    paginated: null,
  };

  self.orderBy = function (by) {
    if (self.order.by === by) {
      self.order.desc = !self.order.desc;
    } else {
      self.order.by = by;
    }
  };

  self.edit = function (functionKey) {
    const modal = $uibModal.open({
      animation: true,
      templateUrl: 'app/telecom/telephony/line/phone/programmableKeys/edit/telecom-telephony-line-phone-programmableKeys-edit.html',
      controller: 'TelecomTelephonyLinePhoneProgammableKeysEditCtrl',
      controllerAs: 'ProgammableKeysEditCtrl',
      resolve: {
        functionKey() { return functionKey; },
      },
    });

    modal.result.then(() => self.getPhone(), (error) => {
      if (error && error.type === 'API') {
        TucToast.error($translate.instant('telephony_line_phone_programmableKeys_save_error', { error: error.msg }));
      }
      return self.getPhone();
    });

    return modal;
  };

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;
    self.hasPhone = false;

    TelephonyMediator.getGroup($stateParams.billingAccount).then((group) => {
      self.group = group;
      self.line = self.group.getLine($stateParams.serviceName);

      return self.getPhone();
    }).finally(() => {
      self.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  this.getPhone = function () {
    return self.line.getPhone().then(() => {
      if (self.line.hasPhone) {
        return self.line.phone.initDeffered().then(() => {
          self.functionKeys.raw = angular.copy(self.line.phone.functionKeys);
        });
      }
      return null;
    });
  };

  /* ===========================
  =            BULK            =
  ============================ */

  self.bulkDatas = {
    infos: {
      name: 'functionKeys',
      actions: [{
        name: '',
      }],
    },
  };

  self.getBulkParams = function () {
    self.bulkDatas.infos.actions = self.buildBulkActions();
  };

  self.buildBulkActions = function () {
    return _.map(self.functionKeys.raw, key => ({
      name: 'functionKey',
      route: '/telephony/{billingAccount}/line/{serviceName}/phone/functionKey/{keyNum}'.replace('{keyNum}', key.keyNum),
      method: 'PUT',
      params: {
        function: key.function,
        parameter: key.parameter,
      },
    }));
  };

  self.filterServices = function (services) {
    const filteredServices = _.filter(services, service => ['sip', 'mgcp'].indexOf(service.featureType) > -1);

    return tucVoipLinePhoneFunction
      .fetchAll()
      .then(voipLinePhoneFunctions => _.filter(
        filteredServices,
        service => _.find(voipLinePhoneFunctions, {
          serviceName: service.serviceName,
          billingAccount: service.billingAccount,
        }),
      ));
  };

  self.onBulkSuccess = function (bulkResult) {
    if (bulkResult.error.length) {
      _.set(bulkResult, 'error', _.map(bulkResult.error, (error) => {
        const errorDetails = _.get(error, 'errors[0]');
        _.set(error, 'errors[0].error', errorDetails.statusCode === 501
          ? $translate.instant('telephony_line_phone_programmableKeys_bulk_error_details') : errorDetails.error);

        return error;
      }));
    }

    // display message of success or error
    tucTelephonyBulk.getTucToastInfos(bulkResult, {
      fullSuccess: $translate.instant('telephony_line_phone_programmableKeys_bulk_all_success'),
      partialSuccess: $translate.instant('telephony_line_phone_programmableKeys_bulk_some_success', {
        count: bulkResult.success.length,
      }),
      error: $translate.instant('telephony_line_phone_programmableKeys_bulk_error'),
    }, true).forEach((toastInfo) => {
      TucToast[toastInfo.type](toastInfo.message, {
        hideAfter: null,
      });
    });

    // reset initial values to be able to modify again the options
    TelephonyMediator.resetAllCache();
    init();
  };

  self.onBulkError = function (error) {
    TucToast.error([$translate.instant('telephony_line_phone_programmableKeys_bulk_on_error'), _.get(error, 'msg.data')].join(' '));
  };

  /* -----  End of BULK  ------ */

  init();
});
