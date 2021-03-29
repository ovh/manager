import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import head from 'lodash/head';
import isFunction from 'lodash/isFunction';
import keys from 'lodash/keys';
import last from 'lodash/last';
import map from 'lodash/map';
import partition from 'lodash/partition';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';

export default /* @ngInject */ function (
  $http,
  $filter,
  $q,
  $uibModalInstance,
  modalBindings,
  tucTelecomVoip,
) {
  const self = this;
  let allServices;

  self.loading = {
    init: false,
    bulk: false,
  };

  self.model = {
    billingAccount: null,
    searchService: '',
    selection: {},
  };

  self.state = {
    selectAll: false,
  };

  self.bindings = null;
  self.billingAccounts = null;
  self.serviceList = null;

  /* ==============================
    =            HELPERS            =
    =============================== */

  function getFilteredServiceList() {
    let services = null;

    if (!self.model.billingAccount) {
      services = allServices;
    } else {
      services = filter(allServices, {
        billingAccount: self.model.billingAccount,
      });
    }

    if (self.model.searchService !== '') {
      return $filter('tucPropsFilter')(services, {
        serviceName: self.model.searchService,
        description: self.model.searchService,
      });
    }

    return services;
  }

  self.getSelectedCount = function getSelectedCount() {
    let count = 0;

    keys(self.model.selection).forEach((serviceName) => {
      count += get(self.model.selection, serviceName) === true ? 1 : 0;
    });

    return count;
  };

  self.getSelectedServices = function getSelectedServices() {
    const selectedServices = [];

    keys(self.model.selection).forEach((serviceName) => {
      if (
        self.model.selection[serviceName] === true &&
        self.bindings.serviceName !== serviceName
      ) {
        selectedServices.push({
          billingAccount: find(allServices, {
            serviceName,
          }).billingAccount,
          serviceName,
        });
      }
    });

    return selectedServices;
  };

  /*
   * Highlight services on which a previous succesful bulk action had been made
   */
  self.highlightUpdatedServices = function highlightUpdatedServices(services) {
    forEach(services, (service) => {
      forEach(self.billingAccounts, (billingAccount) => {
        const findService = find(
          billingAccount.services,
          ({ serviceName }) => serviceName === service.serviceName,
        );
        if (findService) {
          findService.hasUpdate = true;
        }
      });
    });
  };

  /* -----  End of HELPERS  ------ */

  /* =============================
    =            EVENTS            =
    ============================== */

  self.cancel = function cancel(reason) {
    return $uibModalInstance.dismiss(reason);
  };

  self.onBillingAccountSelectChange = function onBillingAccountSelectChange() {
    self.state.selectAll = false;
    self.serviceList = getFilteredServiceList();
  };

  self.onToggleAllCheckStateBtnClick = function onToggleAllCheckStateBtnClick() {
    self.state.selectAll = !self.state.selectAll;
    self.serviceList.forEach((service) => {
      if (service.serviceName !== self.bindings.serviceName) {
        set(self.model.selection, service.serviceName, self.state.selectAll);
      }
    });
  };

  self.onSearchServiceInputChange = function onSearchServiceInputChange() {
    self.state.selectAll = false;
    self.serviceList = getFilteredServiceList();
  };

  self.onBulkServiceChoiceFormSubmit = function onBulkServiceChoiceFormSubmit() {
    self.loading.bulk = true;

    // build params for each actions
    if (
      self.bindings.getBulkParams &&
      isFunction(self.bindings.getBulkParams())
    ) {
      self.bindings.bulkInfos.actions.forEach((info) => {
        set(info, 'params', self.bindings.getBulkParams()(info.name));
      });
    }

    // call 2API endpoint
    return $http
      .post(
        `/${[
          'telephony',
          self.bindings.billingAccount,
          'service',
          self.bindings.serviceName,
          'bulk',
        ].join('/')}`,
        {
          bulkInfos: self.bindings.bulkInfos,
          bulkServices: self.getSelectedServices(),
        },
        {
          serviceType: 'aapi',
        },
      )
      .then((result) => {
        const partitionedResult = partition(
          result.data,
          (res) => res.errors.length === 0,
        );

        return $uibModalInstance.close({
          success: head(partitionedResult),
          error: last(partitionedResult),
        });
      })
      .catch((error) =>
        self.cancel({
          type: 'API',
          msg: error,
        }),
      )
      .finally(() => {
        self.loading.bulk = false;
      });
  };

  /* -----  End of EVENTS  ------ */

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  function completeServiceListDetails() {
    // filter service with the modal filters
    self.serviceList = getFilteredServiceList();

    // set current serviceName as selected
    set(self.model.selection, self.bindings.serviceName, true);

    if (self.bindings.previouslyUpdatedServices.length > 0) {
      self.highlightUpdatedServices(self.bindings.previouslyUpdatedServices);
    }
  }

  self.$onInit = function onInit() {
    self.loading.init = true;

    self.bindings = modalBindings;
    self.model.billingAccount = self.bindings.billingAccount;

    return tucTelecomVoip.fetchAll(false).then((billingAccounts) => {
      self.billingAccounts = sortBy(billingAccounts, (billingAccount) =>
        billingAccount.getDisplayedName(),
      );

      // get all services of each billingAccounts and apply a first filter based on serviceType
      allServices = filter(
        flatten(map(self.billingAccounts, 'services')),
        (service) =>
          self.bindings.serviceType === 'all' ||
          service.serviceType === self.bindings.serviceType,
      );

      if (
        self.bindings.filterServices &&
        isFunction(self.bindings.filterServices())
      ) {
        allServices = self.bindings.filterServices()(allServices);
        const filterPromise = isFunction(allServices.then)
          ? allServices
          : $q.when(allServices);

        filterPromise.then((filteredServices) => {
          allServices = filteredServices;
          completeServiceListDetails();
          self.loading.init = false;
        });
      } else {
        completeServiceListDetails();
        self.loading.init = false;
      }
    });
  };

  /* -----  End of INITIALIZATION  ------ */
}
