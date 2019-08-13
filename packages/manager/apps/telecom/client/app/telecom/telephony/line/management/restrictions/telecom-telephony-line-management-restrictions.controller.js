angular.module('managerApp').controller('TelecomTelephonyLineRestrictionsCtrl', function ($stateParams, $timeout, $q, $document, $translate, OvhApiTelephony, TucToastError, TucIpAddress, OvhApiMe, TucToast, tucTelephonyBulk) {
  const self = this;

  function fetchLineOptions() {
    return OvhApiTelephony.Line().v6().getOptions({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise;
  }

  function fetchAccountRestrictions() {
    return OvhApiMe.Telephony().DefaultIpRestriction().v6()
      .query().$promise
      .then(ids => $q.all(ids.map(id => OvhApiMe.Telephony().DefaultIpRestriction().v6().get({
        id,
      }).$promise)))
      .then(ips => _.sortBy(ips, 'id'));
  }

  function init() {
    self.isLoading = true;
    return $q.all({
      options: fetchLineOptions(),
      accountRestrictions: fetchAccountRestrictions(),
    }).then((result) => {
      self.lineOptions = result.options;
      self.lineOptionsForm = angular.copy(self.lineOptions);
      self.accountRestrictions = result.accountRestrictions;
      self.accountRestrictionsForm = angular.copy(self.accountRestrictions);
    }).catch(err => new TucToastError(err)).finally(() => {
      self.isLoading = false;
    });
  }

  self.addLineRestriction = function () {
    if (self.lineOptionsForm.ipRestrictions.length < 6) {
      self.lineOptionsForm.ipRestrictions.push('');
      $timeout(() => {
        const input = $document.find('input.lineIpInput:last');
        if (input) {
          input.focus();
        }
      });
    }
  };

  self.addAccountRestriction = function () {
    if (self.accountRestrictionsForm.length < 6) {
      self.accountRestrictionsForm.push({
        subnet: '',
      });
      $timeout(() => {
        const input = $document.find('input.accountIpInput:last');
        if (input) {
          input.focus();
        }
      });
    }
  };

  self.hasLineRestrictionChanged = function () {
    return !angular.equals(self.lineOptionsForm.ipRestrictions, self.lineOptions.ipRestrictions);
  };

  self.hasAccountRestrictionChanged = function () {
    return !angular.equals(self.accountRestrictions, self.accountRestrictionsForm);
  };

  self.cancelLineChanges = function () {
    self.lineOptionsForm.ipRestrictions = angular.copy(self.lineOptions.ipRestrictions);
  };

  self.cancelAccountChanges = function () {
    self.accountRestrictionsForm = angular.copy(self.accountRestrictions);
  };

  self.applyLineChanges = function () {
    const options = angular.copy(self.lineOptions);
    options.ipRestrictions = self.lineOptionsForm.ipRestrictions;
    self.isChangingLineOptions = true;
    return OvhApiTelephony.Line().v6().setOptions({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, options).$promise.then(() => fetchLineOptions().then((result) => {
      self.lineOptions = result;
      self.lineOptionsForm = angular.copy(self.lineOptions);
    })).then(() => {
      self.changeLineSuccess = true;
      $timeout(() => {
        self.changeLineSuccess = false;
      }, 2000);
    }).catch(err => new TucToastError(err)).finally(() => {
      self.isChangingLineOptions = false;
    });
  };

  self.applyAccountChanges = function () {
    const changes = _.filter(self.accountRestrictionsForm, (ip) => {
      let changed = false;
      if (ip.id) {
        const oldIp = _.find(self.accountRestrictions, { id: ip.id });
        if (oldIp.subnet !== ip.subnet) {
          changed = true;
        }
      }
      return changed;
    });
    const toAdd = _.filter(self.accountRestrictionsForm, ip => !ip.id);
    const toDelete = _.filter(
      self.accountRestrictions,
      ip => ip.id && !_.find(self.accountRestrictionsForm, { id: ip.id }),
    );
    const deletePromise = _.pluck(changes.concat(toDelete), 'id').map(id => OvhApiMe.Telephony().DefaultIpRestriction().v6().remove({
      id,
    }).$promise);
    const addPromise = _.pluck(changes.concat(toAdd), 'subnet').map((ip) => {
      const subnet = ('' || ip).indexOf('/') >= 0 ? ip : `${ip}/32`;
      return OvhApiMe.Telephony().DefaultIpRestriction().v6().create({
        subnet,
        type: 'sip',
      }).$promise;
    });
    self.isChangingAccountOptions = true;
    return $q
      .all(deletePromise)
      .then(() => $q.all(addPromise)).then(() => fetchAccountRestrictions().then((result) => {
        self.accountRestrictions = result;
        self.accountRestrictionsForm = angular.copy(self.accountRestrictions);
      })).then(() => {
        self.changeAccountSuccess = true;
        $timeout(() => {
          self.changeAccountSuccess = false;
        }, 2000);
      })
      .catch(err => new TucToastError(err))
      .finally(() => {
        self.isChangingAccountOptions = false;
      });
  };

  self.ipValidator = (function () {
    return {
      test(value) {
        return TucIpAddress.isValidPublicIp4(value);
      },
    };
  }());

  /* ===========================
    =            BULK            =
    ============================ */

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'ipRestrictions',
      actions: [{
        name: 'options',
        route: '/telephony/{billingAccount}/line/{serviceName}/options',
        method: 'PUT',
        params: null,
      }],
    },
  };

  self.filterServices = function (services) {
    return _.filter(services, service => ['sip'].indexOf(service.featureType) > -1);
  };

  self.getBulkParams = function () {
    return {
      ipRestrictions: self.lineOptionsForm.ipRestrictions,
    };
  };

  self.onBulkSuccess = function (bulkResult) {
    // display message of success or error
    tucTelephonyBulk.getTucToastInfos(bulkResult, {
      fullSuccess: $translate.instant('telephony_line_restrictions_ip_bulk_all_success'),
      partialSuccess: $translate.instant('telephony_line_restrictions_ip_bulk_some_success', {
        count: bulkResult.success.length,
      }),
      error: $translate.instant('telephony_line_restrictions_ip_bulk_error'),
    }).forEach((toastInfo) => {
      TucToast[toastInfo.type](toastInfo.message, {
        hideAfter: null,
      });
    });
    self.applyLineChanges();

    // reset initial values to be able to modify again the options
    OvhApiTelephony.Line().v6().resetAllCache();
    init();
  };

  self.onBulkError = function (error) {
    TucToast.error([$translate.instant('telephony_line_restrictions_ip_bulk_on_error'), _.get(error, 'msg.data')].join(' '));
  };

  /* -----  End of BULK  ------ */

  init();
});
