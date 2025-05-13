import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';

import templateModal from './modal/telephony-bulk-action-modal.html';

export default /* @ngInject */ function(
  $q,
  $translate,
  $translatePartialLoader,
  $uibModal,
  tucTelephonyBulkActionUpdatedServicesContainer,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.previouslyUpdatedServices = [];

  /* =============================
    =            EVENTS            =
    ============================== */

  self.onBulkActionBtnClick = function onBulkActionBtnClick() {
    if (self.onOpen && isFunction(self.onOpen())) {
      self.onOpen()();
    }

    return $uibModal
      .open({
        template: templateModal,
        controller: 'tucTelephonyBulkActionModalCtrl',
        controllerAs: '$ctrl',
        resolve: {
          modalBindings: {
            serviceType: self.serviceType,
            billingAccount: self.billingAccount,
            serviceName: self.serviceName,
            bulkInfos: self.bulkInfos,
            getBulkParams: self.getBulkParams,
            filterServices: self.filterServices,
            previouslyUpdatedServices: self.previouslyUpdatedServices,
            trackingPrefix: self.trackingPrefix,
          },
        },
      })
      .result.then((data) => {
        if (self.onSuccess && isFunction(self.onSuccess())) {
          self.onSuccess()(data);
        }

        if (isArray(data.success)) {
          tucTelephonyBulkActionUpdatedServicesContainer.storeUpdatedServices(
            data.success,
          );
        }
      })
      .catch((error) => {
        if (
          get(error, 'type') === 'API' &&
          self.onError &&
          isFunction(self.onError())
        ) {
          self.onError()(error);
        }
        return $q.reject(error);
      });
  };

  /* -----  End of EVENTS  ------ */

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  function getTranslations() {
    $translatePartialLoader.addPart(
      '../components/telecom/telephony/bulkAction',
    );
    return $translate.refresh();
  }

  self.$onInit = function $onInit() {
    self.loading.init = true;

    self.previouslyUpdatedServices = tucTelephonyBulkActionUpdatedServicesContainer.getUpdatedServices();

    // check for attributes
    // check for serviceType : line or number - default to line
    if (['line', 'number'].indexOf(self.serviceType)) {
      self.serviceType = 'line';
    }

    // load translation
    return getTranslations().finally(() => {
      self.loading.init = false;
    });
  };

  /* -----  End of INITIALIZATION  ------ */
}
