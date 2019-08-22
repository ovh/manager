import get from 'lodash/get';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';

angular.module('managerApp').controller('PackResiliationCtrl', function ($stateParams, $state, $templateCache, $translate, TucToastError, OvhApiPackXdslResiliation, TucToast, $uibModal, $timeout, $q, OvhApiMe, TucPackMediator, resiliationNotification, tucValidator) {
  const self = this;
  self.model = {
    subServicesToKeep: {},
  };
  self.switch = {};
  self.config = {
    orderedServicesToList: [
      'xdslAccess', 'domain', 'voipLine',
      'exchangeAccount', 'exchangeIndividual',
      'exchangeLite', 'exchangeOrganization',
      'voipEcoFax', 'hostedEmail', 'siteBuilderFull',
      'siteBuilderStart', 'voipAlias',
    ],
    xdslAccess: {
      cannotBeKept: true,
    },
  };
  self.resiliationTerms = null;

  this.init = function () {
    self.subServicesTerms = null;
    self.subServicesTermsLoading = false;
    self.loading = true;
    self.model.when = null;
    self.dpOpts = {};

    OvhApiPackXdslResiliation.Aapi().terms({
      packId: $stateParams.packName,
    }).$promise.then((data) => {
      self.dpOpts.minDate = data.data.minResiliationDate
        ? new Date(data.data.minResiliationDate) : new Date();
      self.minResiliationDate = self.dpOpts.minDate;
      self.resiliationTerms = {};

      angular.forEach(data, (val, key) => {
        if (key.indexOf('$') !== 0) {
          self.resiliationTerms[key] = data[key];
        }
      });

      self.resiliationTerms.typeName = $translate.instant('pack_resiliation_type_name');
      if (self.resiliationTerms.data.resiliationReasons) {
        self.resiliationTerms.data.resiliationReasons = self
          .resiliationTerms.data.resiliationReasons.map(reason => ({
            value: reason,
            label: $translate.instant(`pack_resiliation_choice_${reason}`),
          }));
      }

      if (self.resiliationTerms.name) {
        self.resiliationTerms.nameToDisplay = self.resiliationTerms.name;
      } else {
        self.resiliationTerms.nameToDisplay = self.resiliationTerms.packName;
      }

      self.updateFeeSummary();
    }).catch(err => new TucToastError(err)).finally(() => {
      self.loading = false;
    });

    self.subServicesTermsLoading = true;
    self.subServicesTerms = null;
    self.subServicesTermsError = false;

    OvhApiPackXdslResiliation.Aapi().subServicesTerms({
      packId: $stateParams.packName,
    }).$promise.then((data) => {
      self.subServicesTerms = data;
    }).catch((err) => {
      self.subServicesTermsError = true;
      return new TucToastError(err);
    }).finally(() => {
      self.subServicesTermsLoading = false;
    });
  };

  /**
   * Get the current currency symbol
   *
   * @return promise with the symbol of the current currency
   */
  this.getCurrentCurrencySymbol = function () {
    return OvhApiMe.v6().get().$promise.then(me => (me && me.currency ? me.currency.symbol : ''));
  };

  /**
   * Validator for the resiliationDate
   * @param {Date} specifiedDate Date to validate
   */
  this.checkDate = function () {
    return !self.model.when || (tucValidator.isDate(self.model.when)
      && (self.model.when >= self.minResiliationDate));
  };

  /**
   * Apply the state of the global checkbox to all the sub checkbox if needed
   * @param {String} the type of the service
   */
  this.switchApply = function (serviceType) {
    let isUpdated = false;
    angular.forEach(self.subServicesTerms[serviceType], (service) => {
      if (service.keepServiceTerms.isAllowed) {
        self.model.subServicesToKeep[service.id] = self.switch[serviceType];
        isUpdated = true;
      }
    });

    if (isUpdated) {
      self.updateFeeSummary();
    } else {
      $timeout(() => {
        self.switch[serviceType] = !self.switch[serviceType];
      }, 200);
    }
  };

  /**
   * Update the fee summary
   */
  this.updateFeeSummary = function () {
    self.feeSummary = {
      duePrice: get(self, 'resiliationTerms.data.due'),
      keepingPrice: 0.0,
      renewPrice: {},
    };

    self.config.orderedServicesToList.forEach((serviceType) => {
      if (self.subServicesTerms && self.subServicesTerms[serviceType]) {
        self.subServicesTerms[serviceType].forEach((service) => {
          angular.forEach(self.model.subServicesToKeep, (go, serviceId) => {
            let key;

            // the key of the Object is a stringified service id
            if (go && String(service.id) === serviceId) {
              key = service.keepServiceTerms.renewPeriod.toString();

              // [IEEE 754]: store int to avoid flotting point number storage problem
              self.feeSummary.keepingPrice += service.keepServiceTerms.price.value * 100;

              if (self.feeSummary.renewPrice[key] === undefined) {
                self.feeSummary.renewPrice[key] = 0;
              }

              self.feeSummary.renewPrice[key] += service.keepServiceTerms.renewPrice.value * 100;
            }
          });
        });
      }
    });

    // [IEEE 754]: restore real value: Int -> float (.2)
    self.feeSummary.keepingPrice = self.feeSummary.keepingPrice ? Number(self.feeSummary.keepingPrice / 100).toFixed(2) : '0';
    angular.forEach(self.feeSummary.renewPrice, (value, key) => {
      self.feeSummary.renewPrice[key] = Number(self.feeSummary.renewPrice[key] / 100).toFixed(2);
    });

    self.getCurrentCurrencySymbol().then((currency) => {
      self.feeSummary.currency = currency;
    });
  };

  /**
   * Check the state of the global checkbox
   * @param {String} the type of the service
   */
  this.checkSwitchState = function (serviceType) {
    for (let i = 0, imax = self.subServicesTerms[serviceType].length;
      i < imax && self.switch[serviceType];
      i += 1) {
      const service = self.subServicesTerms[serviceType][i];
      if (service.keepServiceTerms.isAllowed && !self.model.subServicesToKeep[service.id]) {
        self.switch[serviceType] = false;
      }
    }
  };

  /**
   * Check/update all things depending of the checked sub services
   * @param {String} the type of the service
   */
  this.updateAllInfluencedByCheckedSubServices = function (serviceType) {
    self.checkSwitchState(serviceType);
    self.updateFeeSummary();
  };

  /**
   * True if serviceType has at least one sub service allowed to be kept,
   * false otherwise.
   */
  this.hasKeepableSubServices = function (serviceType) {
    return some(self.subServicesTerms[serviceType], service => get(service, 'keepServiceTerms.isAllowed'));
  };

  /**
   * Compute the new price according to the new date
   * @returns {*}
   */
  this.computePrice = function () {
    self.computingPrice = true;
    return OvhApiPackXdslResiliation.v6().resiliationTerms({
      packName: $stateParams.packName,
      resiliationDate: self.model.when ? self.model.when.toISOString() : null,
    }, null).$promise.then((data) => {
      self.resiliationTerms.data.due = data.due;
      self.updateFeeSummary();
    }, err => new TucToastError(err)).finally(() => {
      self.computingPrice = false;
    });
  };

  /**
   * Open the date picker
   * @param event
   */
  this.openDatePicker = function (event) {
    self.pickerOpened = true;
    self.pickerOpenedPreventConflict = true;
    event.stopPropagation();

    $timeout(() => {
      self.pickerOpenedPreventConflict = false;
    }, 500);
  };

  /**
   * Switch the date picker state, if is open then close,
   * if is closed then open it
   *
   * @param event
   */
  this.switchDatePickerState = function (event) {
    if (!self.pickerOpenedPreventConflict) {
      self.pickerOpened = !self.pickerOpened;
    }

    event.stopPropagation();
  };

  /**
   * Resiliate a pack
   * @param  {Object} pack   Pack to resiliate
   * @param  {Object} survey Reason to resiliate
   * @param {Boolean} accept If true the resiliation must be done
   */
  this.resiliatePack = function () {
    self.loading = true;
    return OvhApiPackXdslResiliation.v6().resiliate({
      packName: $stateParams.packName,
    }, {
      resiliationSurvey: {
        type: self.model.reason.value,
        comment: self.model.comment ? self.model.comment : null,
      },
      resiliationDate: self.model.when ? self.model.when.toISOString() : null,
      servicesToKeep:
        remove(map(self.model.subServicesToKeep, (value, key) => (value ? key : null)), null),
    }).$promise.then(() => {
      set(resiliationNotification, 'success', true);
      $state.go('telecom.pack', { packName: $stateParams.packName });
    }).catch(err => new TucToastError(err)).finally(() => {
      self.loading = false;
    });
  };

  /**
   * Cancel an on-going resiliation
   * @param  {Object} pack Pack to cancel resiliation
   */
  this.cancelPackResiliation = function (pack) {
    self.loading = true;
    return OvhApiPackXdslResiliation.v6().cancelResiliation({
      packName: pack.packName,
    }, null).$promise.then(() => {
      set(resiliationNotification, 'cancelSuccess', true);
      $state.go('telecom.pack', { packName: $stateParams.packName });
    }, err => new TucToastError(err)).finally(() => {
      self.loading = false;
    });
  };

  this.openConfirmation = function () {
    $uibModal.open({
      template: $templateCache.get('resiliation.modal.html'),
      controllerAs: 'ResiliationModelCtrl',
      controller(subject) {
        this.resiliation = { confirm: {} };
        this.subject = subject;
      },
      resolve: {
        subject() {
          return self.resiliationReason;
        },
      },
    }).result.then(self.resiliatePack);
  };

  this.init();
});
