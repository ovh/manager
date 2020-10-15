import filter from 'lodash/filter';
import find from 'lodash/find';
import keys from 'lodash/keys';

export default /* @ngInject */ function TelephonyNumberRedirectCtrl(
  $q,
  $translate,
  TelephonyMediator,
  tucVoipServiceTask,
  TucToast,
) {
  const self = this;
  let selectedService = null;

  self.group = null;
  self.destinationService = null;
  self.availableServices = null;

  self.displayHelpers = {
    currentGroupServiceCount: null,
    hasOtherGroups: false,
    availableTypes: undefined,
    hiddenGroups: [],
    serviceChoicePopoverOptions: {
      popoverTrigger: 'none',
      popoverPlacement: 'auto right',
      popoverClass: 'pretty-popover telephony-service-choice-popover',
      popoverAppendToBody: true,
      popoverIsOpen: false,
    },
  };

  /*= ==============================
    =            HELPERS            =
    =============================== */

  /**
   *  Get the destination service
   */
  function getDestinationService(destinationServiceNameParam) {
    let destinationServiceName = destinationServiceNameParam;

    if (!destinationServiceName) {
      destinationServiceName = self.numberCtrl.number.feature.destination;
    }

    const serviceFromCurrentGroup = destinationServiceName
      ? self.group.getService(destinationServiceName)
      : null;
    return (
      serviceFromCurrentGroup ||
      TelephonyMediator.findService(destinationServiceName)
    );
  }

  function getNumberList() {
    return self.numberCtrl.number.feature.featureType === 'ddi'
      ? []
      : filter(
          self.group.numbers,
          (number) => number.serviceName !== self.numberCtrl.number.serviceName,
        );
  }

  function refreshAvailableServices() {
    self.availableServices = [];

    // set service of current group
    if (self.displayHelpers.currentGroupServiceCount <= 4) {
      self.availableServices = getNumberList().concat(
        self.group.lines,
        self.group.fax,
      );
    }

    // manage selected service
    selectedService = getDestinationService();
    if (
      selectedService &&
      !find(self.availableServices, {
        serviceName: selectedService.serviceName,
      })
    ) {
      self.availableServices.push(selectedService);
    }

    return self.availableServices;
  }

  /**
   *  Set the save feature for parent component
   */
  function saveFeature() {
    return self.numberCtrl.number.feature
      .save()
      .then((task) =>
        tucVoipServiceTask
          .startPolling(
            self.numberCtrl.number.billingAccount,
            self.numberCtrl.number.serviceName,
            task.taskId,
            {
              namespace: `numberRedirectTask_${self.numberCtrl.number.serviceName}`,
              interval: 1000,
              retryMaxAttempts: 0,
            },
          )
          .then(
            () => {
              // number feature is save - stop its edition
              self.numberCtrl.number.stopEdition(false, true);
            },
            (error) => {
              if (error.status === 404) {
                // consider number feature as saved - stop its edition
                self.numberCtrl.number.stopEdition(false, true);
                return $q.when(true);
              }
              return $q.reject(error);
            },
          ),
      )
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_number_feature_redirect_save_error'),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.numberCtrl.loading.save = false;
      });
  }

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onDestinationChange = function onDestinationChange() {
    const isPending = self.numberCtrl.number.feature.destination === 'pending';
    self.displayHelpers.serviceChoicePopoverOptions.popoverIsOpen = isPending;
  };

  self.onFeatureStartEdit = function onFeatureStartEdit() {
    if (
      !self.numberCtrl.number.feature.destination &&
      self.displayHelpers.hasOtherGroups &&
      self.displayHelpers.currentGroupServiceCount > 4
    ) {
      self.displayHelpers.serviceChoicePopoverOptions.popoverIsOpen = true;
      self.numberCtrl.number.feature.destination = 'pending';
    }

    return refreshAvailableServices();
  };

  self.onFeatureStopEdit = function onFeatureStopEdit() {
    self.destinationService = getDestinationService();
  };

  self.manageCancelChoice = function manageCancelChoice() {
    self.numberCtrl.number.feature.destination = selectedService
      ? selectedService.serviceName
      : self.numberCtrl.number.feature.stopEdition(true).startEdition()
          .destination;
    return refreshAvailableServices();
  };

  self.manageValidateChoice = function manageValidateChoice(service) {
    self.numberCtrl.number.feature.destination = service.serviceName;
    return self.numberCtrl.saveNumber();
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /**
   *  Component initialization
   */
  self.$onInit = function $onInit() {
    self.numberCtrl.loading.feature = true;

    // set save feature function
    self.numberCtrl.saveFeature = saveFeature;

    // load resource needed for redirect
    return TelephonyMediator.getGroup(self.numberCtrl.number.billingAccount)
      .then((group) => {
        self.group = group;

        return TelephonyMediator.getAll().then(() => {
          const numberList = getNumberList();

          self.displayHelpers.currentGroupServiceCount =
            numberList.length + self.group.lines.length + self.group.fax.length;

          // set display helpers
          self.displayHelpers.hasOtherGroups =
            keys(TelephonyMediator.groups).length > 1;
          self.displayHelpers.availableTypes =
            self.numberCtrl.number.feature.featureType === 'ddi'
              ? ['trunk', 'sip', 'plugAndFax']
              : undefined;
          if (
            self.displayHelpers.hasOtherGroups &&
            self.displayHelpers.currentGroupServiceCount <= 4
          ) {
            self.displayHelpers.hiddenGroups.push(
              self.numberCtrl.number.billingAccount,
            );
          }
        });
      })
      .finally(() => {
        self.numberCtrl.loading.feature = false;
      });
  };

  self.$onDestroy = function $onDestroy() {
    // stop edition of the feature
    self.numberCtrl.number.feature.stopEdition(true);

    // stop task polling
    tucVoipServiceTask.stopPolling(
      `numberRedirectTask_${self.numberCtrl.number.serviceName}`,
    );
  };

  /* -----  End of INITIALIZATION  ------*/
}
