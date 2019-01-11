angular.module('managerApp').controller('TelecomTelephonyBillingAccountAdministrationLinesGroup', function ($scope, $stateParams, $q, $translate, TelephonyMediator, TelephonySidebar, OvhApiTelephony, TucToast, TucToastError) {
  const self = this;

  this.$onInit = function () {
    self.billingAccounts = {
      ids: [],
      paginated: null,
      current: $stateParams.billingAccount,
      selected: null,
    };

    self.services = null;
    self.servicesToAttach = {};
    self.serviceAttachSuccess = {};
    self.serviceAttachErrors = {};

    const getNumberCount = OvhApiTelephony.Number().v6().query({
      billingAccount: $stateParams.billingAccount,
    }).$promise.then(_.size);

    const getLineCount = OvhApiTelephony.Line().v6().query({
      billingAccount: $stateParams.billingAccount,
    }).$promise.then(_.size);

    return $q.all({
      billingAccounts: OvhApiTelephony.v6().query().$promise,
      numberCount: getNumberCount,
      lineCount: getLineCount,
    }).then((result) => {
      self.billingAccounts.ids = result.billingAccounts
        .map(billingAccount => ({ id: billingAccount }));
      self.numberCount = result.numberCount;
      self.lineCount = result.lineCount;
    }, err => new TucToastError(err));
  };

  self.fetchBillingAccountDetails = function (billingAccount) {
    return OvhApiTelephony.v6().get({
      billingAccount: billingAccount.id,
    }).$promise;
  };

  self.selectBillingAccount = function (ba) {
    if (ba && ba.billingAccount !== self.billingAccounts.current && ba.status === 'enabled') {
      self.billingAccounts.selected = ba;
      self.fetchBillingAccountServices(ba);
    }
  };

  self.cancelBillingAccountSelection = function () {
    self.billingAccounts.selected = null;
    self.servicesToAttach = {};
  };

  self.fetchBillingAccountServices = function (ba) {
    self.services = null;

    // get batch line details
    const lines = OvhApiTelephony.Line().v6()
      .query({
        billingAccount: ba.billingAccount,
      }).$promise
      .then(ids => $q.all(_.map(_.chunk(ids, 50), chunkIds => OvhApiTelephony.Line().v6().getBatch({
        billingAccount: ba.billingAccount,
        serviceName: chunkIds,
      }).$promise)).then(chunkResult => _.pluck(_.flatten(chunkResult), 'value')));

    // get batch alias details
    const aliases = OvhApiTelephony.Number().v6()
      .query({
        billingAccount: ba.billingAccount,
      }).$promise
      .then(ids => $q
        .all(_.map(
          _.chunk(ids, 50),
          chunkIds => OvhApiTelephony.Number().v6().getBatch({
            billingAccount: ba.billingAccount,
            serviceName: chunkIds,
          }).$promise,
        ))
        .then(chunkResult => _.pluck(_.flatten(chunkResult), 'value')));

    return $q.all({
      lines,
      aliases,
    }).then((result) => {
      _.set(result, 'lines', _.compact(result.lines));

      // handle pool of aliases
      const pools = [];
      _.set(result, 'aliases', _.filter(result.aliases, (alias) => {
        if (alias.partOfPool) {
          let pool = _.find(pools, { id: alias.partOfPool });
          if (!pool) {
            pool = {
              id: alias.partOfPool,
              serviceName: alias.serviceName,
              aliases: [],
            };
            pools.push(pool);
          }
          pool.aliases.push(alias);
          return false;
        }
        return true;
      }));
      self.services = result;
      self.services.pools = pools;
    });
  };

  self.getServicesToAttachList = function () {
    return _.values(_.filter(self.servicesToAttach, val => !!val));
  };

  self.attachSelectedServices = function () {
    const errorList = [];
    self.isAttaching = true;

    return $q.all(_.map(self.getServicesToAttachList(), service => OvhApiTelephony.Service().v6()
      .changeOfBillingAccount({
        billingAccount: self.billingAccounts.selected.billingAccount,
        serviceName: service.serviceName,
      }, {
        billingAccountDestination: $stateParams.billingAccount,
      }).$promise
      .then(() => {
        if (service.aliases) {
          self.numberCount += service.aliases.length;
        } else if (service.serviceType === 'line') {
          self.lineCount += 1;
        } else {
          self.numberCount += 1;
        }
        self.serviceAttachSuccess[service.serviceName] = true;
        delete self.serviceAttachErrors[service.serviceName];
      })
      .catch((err) => {
        errorList.push({
          service,
          error: err,
        });
        self.serviceAttachErrors[service.serviceName] = err;
      })))
      .finally(() => {
        self.isAttaching = false;
        self.servicesToAttach = {};
        if (errorList.length === 0) {
          TucToast.success($translate.instant('telephony_lines_group_attach_success'));
        } else {
          TucToast.error($translate.instant('telephony_lines_group_attach_warning'));
        }

        // update sidebar with fresh data
        TelephonyMediator.resetAllCache();
        TelephonySidebar.reset();
      });
  };
});
