import indexOf from 'lodash/indexOf';
import sortBy from 'lodash/sortBy';
import isFunction from 'lodash/isFunction';

export default /* @ngInject */ function voipServiceChoiceCtrl(
  $timeout,
  $scope,
  $q,
  $translate,
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

  self.onChange = function onChange() {
    // call callback function
    if (self.onChoiceChanged && isFunction(self.onChoiceChanged())) {
      self.onChoiceChanged()(self.selectedService, self.choiceArgs);
    }
  };

  self.startLoadServices = function startLoadServices(group) {
    if (loadPromises[group]) {
      return;
    }

    loadPromises[group] = $timeout(() => {
      if (group.services?.length) {
        return;
      }

      TelephonyMediator.getGroup(group.billingAccount).then((mediatorGroup) => {
        Object.assign(group, { services: mediatorGroup.getAllServices() });
        self.loading.services[group] = false;
      });
    }, 1000);
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
      })
      .finally(() => {
        self.loading.init = false;
      });
  };
}
