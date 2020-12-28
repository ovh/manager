import remove from 'lodash/remove';
import set from 'lodash/set';

export default /* @ngInject */ function TelecomTelephonyLineAssistRmaCtrl(
  $stateParams,
  $q,
  $translate,
  TucToast,
  TucToastError,
  OvhApiTelephony,
) {
  const self = this;

  function init() {
    self.rmaList = null;
    return self
      .fetchRma()
      .then((result) => {
        self.rmaList = result;
      })
      .catch((err) => new TucToastError(err));
  }

  self.fetchPhone = function fetchPhone() {
    return OvhApiTelephony.Line()
      .Phone()
      .v6()
      .get({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise;
  };

  self.fetchRma = function fetchRma() {
    return OvhApiTelephony.Line()
      .Phone()
      .RMA()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.catch((err) => {
        if (err.status === 404) {
          // line has no phone
          return [];
        }
        return $q.reject(err);
      })
      .then((rmaIds) =>
        $q.all(
          rmaIds.map(
            (id) =>
              OvhApiTelephony.Line()
                .Phone()
                .RMA()
                .v6()
                .get({
                  billingAccount: $stateParams.billingAccount,
                  serviceName: $stateParams.serviceName,
                  id,
                }).$promise,
          ),
        ),
      );
  };

  self.cancelRma = function cancelRma(rma) {
    set(rma, 'isCancelling', true);
    return OvhApiTelephony.Line()
      .Phone()
      .RMA()
      .v6()
      .cancel({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        id: rma.id,
      })
      .$promise.then(() => {
        remove(self.rmaList, { id: rma.id });
        TucToast.success(
          $translate.instant('telephony_line_assist_rma_cancel_success'),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        set(rma, 'isCancelling', false);
      });
  };

  self.formatEquipementReference = function formatEquipementReference(ref) {
    // example : 'AB12345' => 'AB:12:34:5'
    return ((ref || '').match(/\w{1,2}/g) || []).join(':');
  };

  self.getPdfUrl = function getPdfUrl(rma) {
    return `http://www.ovh.com/cgi-bin/telephony/rma.pl?reference=${rma.id}`;
  };

  init();
}
