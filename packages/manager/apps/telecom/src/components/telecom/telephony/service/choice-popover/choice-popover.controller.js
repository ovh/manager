import filter from 'lodash/filter';
import find from 'lodash/find';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import uniq from 'lodash/uniq';

export default /* @ngInject */ function voipServiceChoicePopoverCtrl(
  $scope,
  $q,
  $translate,
  $translatePartialLoader,
  $filter,
  TelephonyMediator,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.status = {
    move: false,
    toShow: null,
  };

  self.popoverStatus = {
    move: false,
    rightPage: null,
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
    // close popover
    self.popoverOptions.popoverIsOpen = false;

    // call callback function
    if (self.onChoiceValidated()) {
      self.onChoiceValidated()(self.selectedService, self.choiceArgs);
    }
    delete self.selectedService;
    self.search = '';
  };

  self.onCancel = function onCancel() {
    // close popover
    self.popoverOptions.popoverIsOpen = false;

    // call callback function
    if (self.onChoiceCancel()) {
      self.onChoiceCancel()(self.choiceArgs);
    }
    delete self.selectedService;
    self.search = '';
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
        services: TelephonyMediator.getAll(),
      })
      .then((result) => {
        self.groupList = map(
          filter(
            uniq(map(result.services, 'billingAccount')),
            (id) => indexOf(self.hiddenGroups, id) < 0,
          ),
          (id) => find(TelephonyMediator.groups, { billingAccount: id }),
        );
      })
      .finally(() => {
        self.loading.init = false;
      });
  };
}
