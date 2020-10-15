import get from 'lodash/get';
import map from 'lodash/map';
import pick from 'lodash/pick';
import set from 'lodash/set';

export default /* @ngInject */ function TelecomTelephonyServiceFaxCustomDomainsCtrl(
  $filter,
  $q,
  $stateParams,
  $timeout,
  $translate,
  OvhApiDomain,
  TelephonyMediator,
  TucToast,
  OvhApiMe,
) {
  const self = this;

  /* ===============================
  =            HELPERS            =
  =============================== */

  function fetchDomains() {
    return OvhApiDomain.v7()
      .query()
      .execute().$promise;
  }

  function fetchCustomDomains() {
    return OvhApiMe.Fax()
      .CustomDomains()
      .v6()
      .query()
      .$promise.then((customDomainsIds) =>
        $q.all(
          map(
            customDomainsIds,
            (id) =>
              OvhApiMe.Fax()
                .CustomDomains()
                .v6()
                .get({
                  id,
                }).$promise,
          ),
        ),
      );
  }

  /* -----  End of HELPERS  ------ */

  /* ===============================
  =            ACTIONS            =
  =============================== */

  self.sortCustomDomains = function sortCustomDomains() {
    let data = angular.copy(self.customDomains.raw);
    data = $filter('orderBy')(
      data,
      self.customDomains.orderBy,
      self.customDomains.orderDesc,
    );
    self.customDomains.sorted = data;
  };

  self.addCustomDomains = function addCustomDomains(form) {
    self.addCustomDomainsForm.isAdding = true;
    return OvhApiMe.Fax()
      .CustomDomains()
      .v6()
      .create({}, pick(self.addCustomDomainsForm, 'domain'))
      .$promise.then(() => {
        form.$setPristine();
        self.addCustomDomainsForm.domain = null;
        TucToast.success(
          $translate.instant(
            'telephony_service_fax_custom_domains_configuration_form_add_success',
          ),
        );
        return self.refresh();
      })
      .catch((err) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_service_fax_custom_domains_configuration_form_add_error',
            ),
            get(err, 'data.message', ''),
          ].join(' '),
        );
      })
      .finally(() => {
        self.addCustomDomainsForm.isAdding = false;
      });
  };

  self.cancelCustomDomains = function cancelCustomDomains(form) {
    form.$setPristine();
    self.addCustomDomainsForm.domain = null;
  };

  self.removeCustomDomains = function removeCustomDomains(domain) {
    set(domain, 'isDeleting', true);
    return $q
      .all([
        OvhApiMe.Fax()
          .CustomDomains()
          .v6()
          .remove({
            id: get(domain, 'id'),
          }).$promise,
        $timeout(angular.noop, 500),
      ])
      .then(() => {
        TucToast.success(
          $translate.instant(
            'telephony_service_fax_custom_domains_configuration_form_remove_success',
          ),
        );
        return self.refresh();
      })
      .catch((err) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_service_fax_custom_domains_configuration_form_remove_error',
            ),
            get(err, 'data.message', ''),
          ].join(' '),
        );
      })
      .finally(() => {
        set(domain, 'isDeleting', false);
      });
  };

  self.refresh = function refresh() {
    self.customDomains.isLoading = true;
    return $q
      .all({
        domains: fetchDomains(),
        customDomains: fetchCustomDomains(),
      })
      .then((result) => {
        self.domains = result.domains;
        self.customDomains.raw = result.customDomains;
        self.sortCustomDomains();
      })
      .catch((err) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_service_fax_custom_domains_error_loading',
            ),
            get(err, 'data.message', ''),
          ].join(' '),
        );
      })
      .finally(() => {
        self.customDomains.isLoading = false;
      });
  };

  /* -----  End of ACTIONS  ------ */

  /* ======================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.loading = {
      init: false,
    };
    self.fax = null;
    self.domains = null;
    self.customDomains = {
      raw: [],
      paginated: null,
      sorted: null,
      orderBy: 'domain',
      orderDesc: false,
      isLoading: false,
    };
    self.addCustomDomainsForm = {
      domain: null,
      isAdding: false,
    };
    self.loading.init = true;
    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.fax = group.getFax($stateParams.serviceName);
        return self.refresh();
      })
      .catch((err) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_service_fax_custom_domains_error_loading',
            ),
            get(err, 'data.message', ''),
          ].join(' '),
        );
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
