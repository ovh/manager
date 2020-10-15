import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import some from 'lodash/some';
import times from 'lodash/times';

export default /* @ngInject */ function TelecomTelephonyLineManagementOfferChangeCtrl(
  $q,
  $stateParams,
  $translate,
  TelephonyMediator,
  TucToast,
  OvhApiTelephony,
  tucTelephonyBulk,
) {
  const self = this;

  self.loading = {
    init: false,
    save: false,
    cancel: false,
  };

  self.group = null;
  self.line = null;
  self.availableOffers = null;

  self.model = {
    offer: null,
    isEditing: false,
  };

  self.initError = null;

  /* ==============================
    =            HELPERS            =
    =============================== */

  /**
   * Get pending offer change.
   * @return {Promise}
   */
  function getPendingOfferChange() {
    return self.line.getOfferChange().catch((error) => {
      TucToast.error(
        [
          $translate.instant(
            'telephony_line_management_change_offer_change_error_init',
          ),
          (error.data && error.data.message) || '',
        ].join(' '),
      );
      return $q.reject(error);
    });
  }

  /**
   * Has changed.
   * @return {Boolean}
   */
  self.hasChanged = function hasChanged() {
    return !angular.equals(
      self.line.offerInformations.name,
      self.model.offer.name,
    );
  };

  /* -----  End of HELPERS  ------ */

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;
    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.group = group;
        self.line = self.group.getLine($stateParams.serviceName);
        return $q
          .all({
            currentOfferInformations: self.line.getCurrentOfferInformations(),
            pendingOfferChange: getPendingOfferChange(),
            availableOffers: self.line.getAvailableOffers(),
          })
          .then((results) => {
            self.availableOffers = results.availableOffers;

            // this is not sexy but we don't have information about the offer name for the moment
            self.model.offer = find(self.availableOffers, {
              type: get(self.line, 'offerInformations.type'),
              description: get(self.line, 'offerInformations.description'),
            });
          })
          .catch((firstError) => {
            TucToast.error(
              [
                $translate.instant(
                  'telephony_line_management_change_offer_change_error_init',
                ),
                get(firstError, 'data.message', ''),
              ].join(' '),
            );
            self.initError = firstError;
            return $q.reject(firstError);
          });
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_line_management_change_offer_change_error_init',
            ),
            get(error, 'data.message', ''),
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */

  /* =============================
    =            EVENTS            =
    ============================== */

  /**
   * Toggle edit mode.
   */
  self.toggleEditMode = function toggleEditMode() {
    self.model.isEditing = !self.model.isEditing;
  };

  /**
   * Toggle edit mode.
   */
  self.toggleCancelMode = function toggleCancelMode() {
    self.model.isCanceling = !self.model.isCanceling;
  };

  /**
   * Change offer.
   * @return {Promise}
   */
  self.changeOffer = function changeOffer() {
    self.loading.save = true;
    return self.line
      .changeOffer(self.model.offer)
      .then(() => {
        self.toggleEditMode();
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_line_management_change_offer_change_error_save',
            ),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.save = false;
      });
  };

  /**
   * Cancel offer change.
   * @return {Promise}
   */
  self.cancelOfferChange = function cancelOfferChange() {
    self.loading.cancel = true;
    return self.line
      .cancelOfferChange()
      .then(() => self.line.getCurrentOfferInformations())
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_line_management_change_offer_change_pending_cancel_error',
            ),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.cancel = false;
      });
  };

  /* -----  End of EVENTS  ------ */

  /* ===========================
    =            BULK            =
    ============================ */

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'offerChange',
      actions: [
        {
          name: 'offerChange',
          route:
            '/telephony/{billingAccount}/service/{serviceName}/offerChange',
          method: 'POST',
          params: null,
        },
      ],
    },
  };

  self.filterServices = function filterServices(services) {
    function filterServicesByOffer(paramServices, listOffers) {
      const servicesFiltered = [];

      times(listOffers.length, (index) => {
        if (some(listOffers[index], { name: self.model.offer.name })) {
          servicesFiltered.push(paramServices[index]);
        }
      });

      return $q.when(servicesFiltered);
    }

    function callGetOfferChanges(billingAccount, serviceName) {
      return OvhApiTelephony.Service()
        .v6()
        .offerChanges({
          billingAccount,
          serviceName,
        }).$promise;
    }

    const promises = [];
    const filteredServices = filter(
      services,
      (service) => ['sip', 'mgcp'].indexOf(service.featureType) > -1,
    );

    forEach(filteredServices, (service) => {
      promises.push(
        callGetOfferChanges(service.billingAccount, service.serviceName),
      );
    });

    return $q
      .allSettled(promises)
      .then((listOffers) => filterServicesByOffer(filteredServices, listOffers))
      .catch((listOffers) =>
        filterServicesByOffer(filteredServices, listOffers),
      );
  };

  self.getBulkParams = function getBulkParams() {
    return {
      offer: self.model.offer.name,
    };
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_line_management_change_offer_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_line_management_change_offer_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant(
          'telephony_line_management_change_offer_bulk_error',
        ),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    self.toggleEditMode();

    // reset initial values to be able to modify again the options
    self.model.isCanceling = false;
    init();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant(
          'telephony_line_management_change_offer_bulk_on_error',
        ),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  /* -----  End of BULK  ------ */

  init();
}
