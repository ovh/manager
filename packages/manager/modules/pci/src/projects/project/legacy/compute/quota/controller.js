import find from 'lodash/find';
import map from 'lodash/map';

export default /* @ngInject */ function CloudProjectComputeQuotaCtrl(
  $q,
  $stateParams,
  $translate,
  PCI_REDIRECT_URLS,
  OvhApiCloudProject,
  OvhApiCloudProjectQuota,
  OvhApiMe,
  CucCloudMessage,
  OtrsPopupService,
  CucRegionService,
  coreConfig,
) {
  // ---------VARIABLE DECLARATION---------
  const self = this;
  const serviceName = $stateParams.projectId;

  this.loader = {
    quota: false,
    unleash: false,
  };

  this.datas = {
    quota: null,
    defaultPaymentMean: null,
  };

  this.state = {
    isRestrictedQuota: false,
  };

  this.region = coreConfig.getRegion();

  // PaymentMean URL (v6 dedicated) with sessionv6
  this.paymentmeanUrl = PCI_REDIRECT_URLS[this.region].paymentMeans;
  this.supportUrl = PCI_REDIRECT_URLS[this.region].support;

  self.regionService = CucRegionService;

  // ---------SUPPORT---------

  this.openSupport = function openSupport() {
    if (!OtrsPopupService.isLoaded()) {
      OtrsPopupService.init();
    } else {
      OtrsPopupService.toggle();
    }
  };

  // ---------UNLEASH---------

  function initPaymentMethods() {
    if (self.region !== 'US') {
      return OvhApiMe.PaymentMean().v6().getDefaultPaymentMean();
    }

    return OvhApiMe.PaymentMethod().v6().query({
      status: 'VALID',
    }).$promise.then(paymentMethodIds => map(
      paymentMethodIds,
      paymentMethodId => $q.all(
        OvhApiMe.PaymentMethod().v6().get({
          id: paymentMethodId,
        }).$promise,
      ),
    )).then(paymentMethods => find(paymentMethods, {
      default: true,
    }));
  }

  function init() {
    const initQueue = [];

    self.loader.quota = true;
    self.loader.unleash = false;

    // check default payment mean
    initQueue.push(initPaymentMethods().then((defaultPaymentMean) => {
      self.datas.defaultPaymentMean = defaultPaymentMean;
    }));

    // get quota
    initQueue.push(OvhApiCloudProjectQuota.v6().query({
      serviceName,
    }).$promise.then((quotas) => {
      self.datas.quota = quotas;
    }));

    return $q.all(initQueue).then(() => {
      // check if quota is restricted
      if (self.datas.quota.length) {
        self.state.isRestrictedQuota = self.datas.quota[0].maxInstances === 1
          && self.datas.quota[0].maxCores === 1
          && self.datas.quota[0].maxRam === 2048;
      }
    }, (err) => {
      CucCloudMessage.error([
        $translate.instant('cpb_quota_loading_error'),
        (err.data && err.data.message) || '',
      ].join(' '));
      self.datas.quota = null;
    }).finally(() => {
      self.loader.quota = false;
    });
  }

  this.unleashAccount = function unleashAccount() {
    self.loader.unleash = true;

    return OvhApiCloudProject.v6().unleash({
      serviceName,
    }, {}).$promise.then(() => {
      init();
    }, (err) => {
      if (err.status === 403) {
        CucCloudMessage.error($translate.instant('cpb_quota_already_unleashed'));
      } else {
        CucCloudMessage.error($translate.instant('cpb_quota_unleash_error'));
      }
      init();
    }).finally(() => {
      self.loader.unleash = false;
    });
  };

  // ---------INITIALIZATION---------

  init();
}
