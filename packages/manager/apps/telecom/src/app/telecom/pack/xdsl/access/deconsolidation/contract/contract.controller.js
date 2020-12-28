export default /* @ngInject */ function XdslDeconsolidationContractCtrl(
  $uibModalInstance,
  data,
  TucToastError,
  URLS,
  OvhApiXdslDeconsolidation,
  OvhApiMeVipStatus,
  $q,
) {
  const self = this;

  this.rio = data.rio;
  this.loading = false;
  this.serviceName = data.serviceName;

  this.checkboxSelected1 = false;
  this.checkboxSelected2 = false;
  this.checkboxSelected3 = false;

  this.terms = null;
  this.packAdslPro2013 = URLS.generalConditions.packAdslPro2013;
  this.packAdslEnterprise2013 = URLS.generalConditions.packAdslEnterprise2013;

  this.cancel = function cancel() {
    $uibModalInstance.dismiss('cancel');
  };

  function getTerms() {
    return OvhApiXdslDeconsolidation.v6()
      .terms({
        serviceName: self.serviceName,
      })
      .$promise.then((terms) => {
        self.terms = terms;
      }, TucToastError)
      .finally(() => {
        self.loading = false;
      });
  }

  function getIsVIP() {
    return OvhApiMeVipStatus.v6()
      .get()
      .$promise.then(
        (vipStatus) => {
          self.isVIP = vipStatus.telecom;
        },
        (err) => new TucToastError(err),
      );
  }

  this.confirm = function confirm() {
    self.loading = true;
    OvhApiXdslDeconsolidation.v6()
      .requestTotalDeconsolidation(
        {
          serviceName: self.serviceName,
        },
        self.rio ? { rio: self.rio } : null,
      )
      .$promise.then((result) => {
        $uibModalInstance.close(result);
      }, TucToastError)
      .finally(() => {
        self.loading = false;
      });
  };

  function init() {
    self.loading = true;

    $q.all([getTerms(), getIsVIP()]).finally(() => {
      self.loading = false;
    });
  }

  init();
}
