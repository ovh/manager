import indexOf from 'lodash/indexOf';
import sortBy from 'lodash/sortBy';
import isFunction from 'lodash/isFunction';

export default /* @ngInject */ function voipServiceChoiceCtrl(
  $timeout,
  $scope,
  $q,
  $translate,
  $element,
  tucVoipBillingAccount,
  TelephonyMediator,
) {
  const self = this;
  const loadPromises = {};

  self.loading = {
    init: false,
    services: {},
  };

  self.status = {
    move: false,
    toShow: null,
  };

  self.search = '';
  self.groupList = [];
  self.selectedService = null;

  self.getServiceType = function getServiceType(service) {
    if (service.serviceType === 'alias') {
      return 'number';
    }
    if (service.isFax) {
      return 'fax';
    }
    if (service.isTrunk && service.isTrunk()) {
      return 'trunk';
    }
    return service.isPlugNFax ? 'plugAndFax' : 'sip';
  };

  self.excludeFilter = function excludeFilter(service) {
    if (angular.isArray(self.excludeServices)) {
      return self.excludeServices.indexOf(service.serviceName) < 0;
    }
    return true;
  };

  self.availableFilter = (service) => {
    if (self.availableTypes) {
      return indexOf(self.availableTypes, self.getServiceType(service)) >= 0;
    }
    return true;
  };

  self.onValidate = function onValidate() {
    // call callback function
    if (self.onChoiceValidated && isFunction(self.onChoiceValidated())) {
      self.onChoiceValidated()(self.selectedService, self.choiceArgs);
    }
    delete self.selectedService;
    self.search = '';
  };

  self.onCancel = function onCancel() {
    // call callback function
    if (self.onChoiceCancel && isFunction(self.onChoiceCancel())) {
      self.onChoiceCancel()(self.choiceArgs);
    }
    delete self.selectedService;
    self.search = '';
  };

  self.onChange = function onChange(service) {
    self.selectedService = service;
    // call callback function
    if (self.onChoiceChanged && isFunction(self.onChoiceChanged())) {
      self.onChoiceChanged()(self.selectedService, self.choiceArgs);
    }
  };

  self.startLoadServices = (group, { immediate } = {}) => {
    if (loadPromises[group]) {
      return null;
    }

    const doStartLoadServices = () => {
      if (group.services?.length) {
        return null;
      }

      return TelephonyMediator.getGroup(group.billingAccount)
        .then((mediatorGroup) => {
          const mediatorGroupServices = mediatorGroup.getAllServices();

          if (self.filterServices) {
            return $q.when(
              self.filterServices(
                mediatorGroup,
                mediatorGroupServices,
                self.choiceArgs,
              ),
            );
          }

          return $q.when(mediatorGroupServices);
        })
        .then((services) => {
          Object.assign(group, { services });
        })
        .finally(() => {
          self.loading.services[group] = false;
          // Manually triggers the in-view plugin directive
          $element.find('#groups').click();
        });
    };

    if (immediate) {
      return doStartLoadServices();
    }

    const loadPromise = $timeout(() => doStartLoadServices(), 1000);

    loadPromises[group] = loadPromise;

    return loadPromise;
  };

  self.stopLoadServices = function stopLoadServices(group) {
    if (loadPromises[group]) {
      $timeout.cancel(loadPromises[group]);
      delete loadPromises[group];
    }
  };

  self.$onInit = () => {
    self.loading.init = true;

    $scope.$watch('$ctrl.search', () => {
      // reset selected service
      self.selectedService = null;
    });

    return $q
      .all({
        translations: $translate.refresh(),
        groupList: tucVoipBillingAccount.fetchAll(),
      })
      .then(({ groupList }) => {
        self.groupList = sortBy(groupList, [
          (group) => group.getDisplayedName(),
        ]);

        if (this.hiddenGroups?.length) {
          self.groupList = self.groupList.filter(
            ({ billingAccount }) => !self.hiddenGroups.includes(billingAccount),
          );
        }

        self.groupList.forEach((group) => {
          self.loading.services[group] = true;
        });

        if (this.preloadGroup) {
          const preloadGroup = self.groupList.find(
            ({ billingAccount }) => billingAccount === this.preloadGroup,
          );
          if (preloadGroup) {
            self.groupList.splice(self.groupList.indexOf(preloadGroup), 1);
            self.groupList.unshift(preloadGroup);
            return this.startLoadServices(preloadGroup, {
              immediate: true,
            });
          }
        }

        return null;
      })
      .finally(() => {
        self.loading.init = false;
      });
  };
}
