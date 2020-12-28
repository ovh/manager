import compact from 'lodash/compact';
import get from 'lodash/get';
import head from 'lodash/head';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import pick from 'lodash/pick';

export default /* @ngInject */ function TelecomTelephonyServiceFaxConvertToVoicefaxCtrl(
  $q,
  $stateParams,
  $timeout,
  $translate,
  OvhApiOrder,
  TucToast,
) {
  const self = this;

  /* ===============================
  =            HELPERS            =
  =============================== */

  function fetchConvertToVoicefaxInformations() {
    return OvhApiOrder.Freefax()
      .v6()
      .query()
      .$promise.then((serviceIds) =>
        $q
          .all(
            map(serviceIds, (service) =>
              OvhApiOrder.Freefax()
                .v6()
                .get({
                  serviceName: service,
                })
                .$promise.then(
                  (allowedOptions) => {
                    if (indexOf(allowedOptions, 'convertToVoicefax') >= 0) {
                      return service;
                    }
                    return null;
                  },
                  () => $q.when(false),
                ),
            ),
          )
          .then((services) =>
            $q.all(
              map(compact(services), (service) =>
                OvhApiOrder.Freefax()
                  .v6()
                  .getConvertToVoicefax({
                    serviceName: service,
                    billingAccount: $stateParams.billingAccount,
                  })
                  .$promise.then((informations) => ({
                    service,
                    informations,
                  })),
              ),
            ),
          ),
      );
  }

  /* -----  End of HELPERS  ------ */

  /* ===============================
  =            EVENTS            =
  =============================== */

  self.changeNumberToConvert = function changeNumberToConvert() {
    self.convertToVoicefaxForm.isChanging = true;
    return $timeout(angular.noop, 500).finally(() => {
      self.convertToVoicefaxForm.isChanging = false;
    });
  };

  /* -----  End of EVENTS  ------ */

  /* ===============================
  =            ACTIONS            =
  =============================== */

  self.orderConvertToVoicefax = function orderConvertToVoicefax() {
    self.convertToVoicefaxForm.isOrdering = true;
    return OvhApiOrder.Freefax()
      .v6()
      .orderConvertToVoicefax(
        {
          serviceName: get(self.convertToVoicefaxForm, 'serviceName.service'),
        },
        pick(self.convertToVoicefaxForm, 'billingAccount'),
      )
      .$promise.then((order) => {
        self.convertToVoicefaxForm.prices = order;
      })
      .catch((err) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_service_fax_convert_to_voicefax_list_error_ordering',
            ),
            get(err, 'data.message', ''),
          ].join(' '),
        );
      })
      .finally(() => {
        self.convertToVoicefaxForm.isOrdering = false;
      });
  };

  /* -----  End of ACTIONS  ------ */

  /* ======================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.isLoading = false;
    self.services = null;
    self.convertToVoicefaxForm = {
      billingAccount: null,
      serviceName: null,
      contracts: false,
      prices: null,
      isChanging: false,
      isOrdering: false,
    };

    self.isLoading = true;
    return fetchConvertToVoicefaxInformations()
      .then((services) => {
        self.services = services;
        self.convertToVoicefaxForm.billingAccount = $stateParams.billingAccount;
        self.convertToVoicefaxForm.serviceName = head(self.services);
      })
      .catch((err) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_service_fax_convert_to_voicefax_list_error_loading',
            ),
            get(err, 'data.message', ''),
          ].join(' '),
        );
      })
      .finally(() => {
        self.isLoading = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
