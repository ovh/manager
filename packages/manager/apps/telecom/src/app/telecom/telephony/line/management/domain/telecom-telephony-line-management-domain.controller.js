angular.module('managerApp').controller('TelecomTelephonyLineDomainCtrl', function ($q, $stateParams, $translate, TelephonyMediator, OvhApiTelephony, OvhApiTelephonyLineOptions, TucToast, tucTelephonyBulk) {
  const self = this;

  self.line = null;
  self.availableSipDomains = {
    line: null,
    client: null,
  };

  self.loading = {
    init: false,
    saveLine: false,
    saveClient: false,
  };

  self.model = {
    lineSipEdit: false,
    clientSipEdit: false,
  };

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.hasClientDomainChange = function () {
    return !_.every(
      self.availableSipDomains.client,
      domain => _.isEqual(domain.prevValue, domain.currentDomain),
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  /* ----------  LINE SIP DOMAIN ACTIONS  ----------*/

  self.startLineDomainEdit = function () {
    self.line.startEdition();
    self.model.lineSipEdit = true;
  };

  self.cancelLineDomainEdit = function () {
    self.line.stopEdition(true);
    self.model.lineSipEdit = false;
  };

  self.validateLineDomain = function () {
    self.loading.saveLine = true;

    return self.line.saveOption('domain', self.line.options.domain).then(() => {
      self.line.stopEdition();
    }, (error) => {
      self.line.stopEdition(true);
      TucToast.error([$translate.instant('telephony_line_management_sip_domain_load_error'), (error.data && error.data.message) || ''].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.saveLine = false;
      self.model.lineSipEdit = false;
    });
  };

  /* ----------  CLIENT SIP DOMAIN ACTIONS  ----------*/

  self.cancelClientDomainEdit = function () {
    _.each(self.availableSipDomains.client, (domain) => {
      _.set(domain, 'currentDomain', domain.prevValue);
    });
    self.model.clientSipEdit = false;
  };

  self.validateClientDomain = function () {
    const requestPromises = [];
    let tmpPromise = null;

    self.loading.saveClient = true;

    _.chain(self.availableSipDomains.client)
      .filter(domain => !_.isEqual(domain.prevValue, domain.currentDomain)).each((domain) => {
        tmpPromise = OvhApiTelephony.v6().setDefaultSipDomain({}, {
          country: domain.country,
          domain: domain.currentDomain,
          type: 'sip',
        }).$promise.then(() => {
          _.set(domain, 'prevValue', domain.currentDomain);
        }, (error) => {
          TucToast.error([$translate.instant('telephony_line_management_sip_domain_load_error'), (error.data && error.data.message) || ''].join(' '));
          return $q.reject(error);
        });

        requestPromises.push(tmpPromise);
      }).value();

    return $q.allSettled(requestPromises).finally(() => {
      self.loading.saveClient = false;
      self.model.clientSipEdit = false;
    });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount, true).then((group) => {
      self.line = group.getLine($stateParams.serviceName);

      return $q.all({
        options: self.line.getOptions(),
        lineDomains: self.line.getAvailableSipDomains(),
        clientDomains: OvhApiTelephony.v6().availableDefaultSipDomains({
          type: 'sip',
        }).$promise,
      }).then((responses) => {
        self.availableSipDomains.line = responses.lineDomains;
        self.availableSipDomains.client = _.map(responses.clientDomains, (domain) => {
          _.set(domain, 'prevValue', domain.currentDomain);
          return domain;
        });
      });
    }).catch((error) => {
      TucToast.error([$translate.instant('telephony_line_management_sip_domain_load_error'), (error.data && error.data.message) || ''].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  /* ===========================
    =            BULK            =
    ============================ */

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'domain',
      actions: [{
        name: 'options',
        route: '/telephony/{billingAccount}/line/{serviceName}/options',
        method: 'PUT',
        params: null,
      }],
    },
  };

  self.filterServices = function (services) {
    return _.filter(services, service => ['sip', 'mgcp'].indexOf(service.featureType) > -1);
  };

  self.getBulkParams = function () {
    return {
      domain: self.line.options.domain,
    };
  };

  self.onBulkSuccess = function (bulkResult) {
    // display message of success or error
    tucTelephonyBulk.getTucToastInfos(bulkResult, {
      fullSuccess: $translate.instant('telephony_line_management_sip_domain_bulk_all_success'),
      partialSuccess: $translate.instant('telephony_line_management_sip_domain_bulk_some_success', {
        count: bulkResult.success.length,
      }),
      error: $translate.instant('telephony_line_management_sip_domain_bulk_error'),
    }).forEach((toastInfo) => {
      TucToast[toastInfo.type](toastInfo.message, {
        hideAfter: null,
      });
    });

    self.validateLineDomain();

    // reset initial values to be able to modify again the options
    OvhApiTelephonyLineOptions.resetCache();
    init();
  };

  self.onBulkError = function (error) {
    TucToast.error([$translate.instant('telephony_line_management_sip_domain_bulk_on_error'), _.get(error, 'msg.data')].join(' '));
  };

  /* -----  End of BULK  ------ */

  init();
});
