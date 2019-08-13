angular.module('managerApp').controller('TelecomTelephonyLineAssistRmaCtrl', function ($stateParams, $q, $translate, TucToast, TucToastError, OvhApiTelephony) {
  const self = this;

  function init() {
    self.rmaList = null;
    return self.fetchRma().then((result) => {
      self.rmaList = result;
    }).catch(err => new TucToastError(err));
  }

  self.fetchPhone = function () {
    return OvhApiTelephony.Line().Phone().v6().get({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise;
  };

  self.fetchRma = function () {
    return OvhApiTelephony.Line().Phone().RMA().v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise.catch((err) => {
        if (err.status === 404) { // line has no phone
          return [];
        }
        return $q.reject(err);
      }).then(rmaIds => $q.all(rmaIds.map(id => OvhApiTelephony.Line().Phone().RMA().v6()
        .get({
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
          id,
        }).$promise)));
  };

  self.cancelRma = function (rma) {
    _.set(rma, 'isCancelling', true);
    return OvhApiTelephony.Line().Phone().RMA().v6()
      .cancel({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        id: rma.id,
      }).$promise
      .then(() => {
        _.remove(self.rmaList, { id: rma.id });
        TucToast.success($translate.instant('telephony_line_assist_rma_cancel_success'));
      })
      .catch(err => new TucToastError(err)).finally(() => {
        _.set(rma, 'isCancelling', false);
      });
  };

  self.formatEquipementReference = function (ref) {
    // example : 'AB12345' => 'AB:12:34:5'
    return ((ref || '').match(/\w{1,2}/g) || []).join(':');
  };

  self.getPdfUrl = function (rma) {
    return `http://www.ovh.com/cgi-bin/telephony/rma.pl?reference=${rma.id}`;
  };

  init();
});
