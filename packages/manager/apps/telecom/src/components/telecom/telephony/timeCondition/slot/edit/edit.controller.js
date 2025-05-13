import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ function voipTimeConditionSlotEditCtrl(
  $scope,
  $timeout,
  $filter,
  $q,
  TelephonyMediator,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.popoverStatus = {
    move: false,
    rightPage: null,
  };

  self.model = {
    slotType: null,
    search: '',
  };

  self.slot = null;
  self.availableSlotTypes = ['number_ovh', 'number', 'voicemail'];
  self.redirectNumberOvh = null;
  self.isLoadingSlotNumber = false;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.getServiceType = function getServiceType(service) {
    if (service.serviceType === 'alias') {
      return 'number';
    }
    if (!service.isFax && service.isTrunk && service.isTrunk()) {
      return 'trunk';
    }
    if (service.isFax) {
      return 'fax';
    }
    return service.isPlugNFax ? 'plug_fax' : 'line';
  };

  self.filterGroupServices = function filterGroupServices(group) {
    if (self.model.slotType === 'number_ovh') {
      return group.getAllServices();
    }

    return [].concat(group.lines, group.fax);
  };

  self.filterDisplayedGroup = function filterDisplayedGroup(group) {
    return $filter('tucPropsFilter')(self.filterGroupServices(group), {
      serviceName: self.model.search,
      description: self.model.search,
    }).length;
  };

  self.isSlotValid = function isSlotValid() {
    return !isEmpty(self.slot.number);
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  /* ----------  SlotType actions  ----------*/

  self.onSlotTypeBtnClick = function onSlotTypeBtnClick() {
    self.popoverStatus.move = true;
    self.popoverStatus.rightPage = 'slotType';
  };

  self.onSlotTypeChange = function onSlotTypeChange() {
    self.popoverStatus.move = false;
    self.model.search = '';

    if (self.model.slotType === 'number') {
      // reset number to let user type its external number
      self.slot.type = 'number';
      self.slot.number = null;
      self.redirectNumberOvh = null;
    } else {
      if (self.model.slotType === 'number_ovh') {
        self.slot.type = 'number';
      } else {
        self.slot.type = 'voicemail';
      }

      if (
        self.model.slotType === 'voicemail' &&
        self.redirectNumberOvh &&
        self.redirectNumberOvh.serviceType !== 'alias'
      ) {
        self.slot.number = self.redirectNumberOvh.serviceName;
        return;
      }

      self.slot.number = null;
      self.redirectNumberOvh = null;
      self.isLoadingSlotNumber = true;

      TelephonyMediator.findService(self.slot.serviceName)
        .then((service) => {
          const currentNumber = service;

          if (currentNumber) {
            self.redirectNumberOvh = currentNumber;
            self.slot.number = currentNumber.serviceName;
          }
        })
        .finally(() => {
          self.isLoadingSlotNumber = false;
        });
    }
  };

  /* ----------  SlotNumber actions  ----------*/

  self.onSlotNumberBtnClick = function onSlotNumberBtnClick() {
    self.popoverStatus.move = true;
    self.popoverStatus.rightPage = 'number';
  };

  self.onSlotNumberChange = function onSlotNumberChange(selectedService) {
    self.popoverStatus.move = false;
    self.slot.number = selectedService.serviceName;
    self.redirectNumberOvh = selectedService;
  };

  /* ----------  Footer actions  ----------*/

  self.onValidateBtnClick = function onValidateBtnClick() {
    self.slot.stopEdition();
  };

  self.onCancelBtnClick = function onCancelBtnClick() {
    self.$onDestroy();
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function onInit() {
    self.loading.init = true;

    return $q
      .allSettled([
        // use of timeout because button click that trigger popover is called after controller init
        $timeout(angular.noop, 99),
      ])
      .then(() => {
        // set slot instance to edit
        self.slot = $scope.$parent.$ctrl.slot.startEdition();

        // set true slot type
        return TelephonyMediator.findService(self.slot.number).then(
          (service) => {
            self.redirectNumberOvh = service;

            if (self.slot.type === 'number' && self.redirectNumberOvh) {
              self.model.slotType = 'number_ovh';
            } else {
              self.model.slotType = self.slot.type;
            }
          },
        );
      })
      .finally(() => {
        self.loading.init = false;
      });
  };

  self.$onDestroy = function $onDestroy() {
    self.slot.stopEdition(true);
  };

  /* -----  End of INITIALIZATION  ------*/
}
