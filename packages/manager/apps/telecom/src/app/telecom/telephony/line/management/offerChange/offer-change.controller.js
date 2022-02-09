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
  atInternet,
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
  self.trackingPrefix =
    'telecom::telephony::billingAccount::line::dashboard::offerChange';

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

  function toggleEditMode() {
    self.model.isEditing = !self.model.isEditing;
  }

  function toggleCancelMode() {
    self.model.isCanceling = !self.model.isCanceling;
  }

  function trackClick(label) {
    atInternet.trackClick({
      name: `${self.trackingPrefix}::${label}`,
      type: 'action',
    });
  }

  function trackPageForOfferChange(prefix, currentOffer = '', newOffer, type) {
    const args = [prefix, type, newOffer.toUpperCase().replace(/\./g, '_')];
    if (currentOffer)
      args.splice(2, 0, currentOffer.toUpperCase().replace(/\./g, '_'));
    atInternet.trackPage({
      name: args.join('::'),
    });
  }

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
   * Go to edit mode.
   */
  self.goToEditMode = function goToEditMode() {
    trackClick('modify');
    toggleEditMode();
  };

  /**
   * Go to read-only mode.
   */
  self.goToReadOnlyMode = function goToReadOnlyMode() {
    trackClick('cancel');
    toggleEditMode();
  };

  /**
   * Toggle edit mode.
   */
  self.cancelOfferChange = function cancelOfferChange() {
    trackClick('cancelOfferChange');
    toggleCancelMode();
  };

  /**
   * Change offer.
   * @return {Promise}
   */
  self.changeOffer = function changeOffer() {
    const offerChangeTrackingPrefix = 'telephony-line-offer-change';
    trackClick('confirm');
    self.loading.save = true;
    return self.line
      .changeOffer(self.model.offer)
      .then(() => {
        trackPageForOfferChange(
          offerChangeTrackingPrefix,
          self.line?.offerInformations?.name,
          self.model.offer?.name,
          'success',
        );
        toggleEditMode();
      })
      .catch((error) => {
        trackPageForOfferChange(
          offerChangeTrackingPrefix,
          self.line?.offerInformations?.name,
          self.model.offer?.name,
          'error',
        );
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
  self.confirmCancelOfferChange = function confirmCancelOfferChange() {
    self.loading.cancel = true;
    trackClick('cancelOfferChange::confirm');
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

  /**
   * Abort cancelling offer change.
   * @return {Promise}
   */
  self.abortCancelOfferChange = function abortCancelOfferChange() {
    trackClick('cancelOfferChange::cancel');
    toggleCancelMode();
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
    trackPageForOfferChange(
      'telephony-line-bulk-offer-change',
      '',
      self.model.offer?.name,
      bulkResult.error.length === 0 ? 'success' : 'partial',
    );
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

    toggleEditMode();

    // reset initial values to be able to modify again the options
    self.model.isCanceling = false;
    init();
  };

  self.onBulkError = function onBulkError(error) {
    trackPageForOfferChange(
      'telephony-line-bulk-offer-change',
      '',
      self.model.offer?.name,
      'error',
    );
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
