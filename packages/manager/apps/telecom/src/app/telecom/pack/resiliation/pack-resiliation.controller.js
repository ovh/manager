import get from 'lodash/get';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';
import { STATUS, URL_PRO_FIBER } from './pack-resiliation.constant';

export default class PackResiliationCtrl {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $stateParams,
    $state,
    $templateCache,
    $translate,
    $timeout,
    $uibModal,
    coreConfig,
    OvhApiPackXdslResiliation,
    TucToast,
    TucToastError,
  ) {
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.$templateCache = $templateCache;
    this.$translate = $translate;
    this.$q = $q;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.coreConfig = coreConfig;
    this.OvhApiPackXdslResiliation = OvhApiPackXdslResiliation;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
    this.$http = $http;
  }

  $onInit() {
    this.STATUS = STATUS;
    this.model = {
      subServicesToKeep: {},
    };
    this.switch = {};
    this.config = {
      orderedServicesToList: [
        'xdslAccess',
        'domain',
        'voipLine',
        'exchangeAccount',
        'exchangeIndividual',
        'exchangeLite',
        'exchangeOrganization',
        'voipEcoFax',
        'hostedEmail',
        'siteBuilderFull',
        'siteBuilderStart',
        'voipAlias',
      ],
      xdslAccess: {
        cannotBeKept: true,
      },
    };
    this.resiliationTerms = null;
    this.subServicesTermsLoading = false;
    this.loading = true;
    this.model.when = null;
    this.dpOpts = {};
    this.isSubsidiaryQuestion = false;
    this.eligibility = null;
    this.isEligible = false;
    this.isEligibleNotYet = false;

    this.OvhApiPackXdslResiliation.Aapi()
      .terms({
        packId: this.$stateParams.packName,
      })
      .$promise.then((data) => {
        this.dpOpts.minDate = data.data.minResiliationDate
          ? new Date(data.data.minResiliationDate)
          : new Date();
        this.minResiliationDate = this.dpOpts.minDate;
        this.resiliationTerms = {};

        angular.forEach(data, (val, key) => {
          if (key.indexOf('$') !== 0) {
            this.resiliationTerms[key] = data[key];
          }
        });

        this.resiliationTerms.typeName = this.$translate.instant(
          'pack_resiliation_type_name',
        );
        if (this.resiliationTerms.data.resiliationReasons) {
          this.resiliationTerms.data.resiliationReasons = this.resiliationTerms.data.resiliationReasons
            .filter(
              (reason) =>
                [
                  'billingProblems',
                  'ftth',
                  'changeOfTerms',
                  'goToCompetitor',
                ].indexOf(reason) === -1,
            )
            .map((reason) => ({
              value: reason,
              label: this.$translate.instant(
                `pack_resiliation_choice_${reason}`,
              ),
            }));
        }

        if (this.resiliationTerms.name) {
          this.resiliationTerms.nameToDisplay = this.resiliationTerms.name;
        } else {
          this.resiliationTerms.nameToDisplay = this.resiliationTerms.packName;
        }

        this.updateFeeSummary();

        this.checkForEligibility();
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.loading = false;
      });

    this.subServicesTermsLoading = true;
    this.subServicesTerms = null;
    this.subServicesTermsError = false;
    this.OvhApiPackXdslResiliation.Aapi()
      .subServicesTerms({
        packId: this.$stateParams.packName,
      })
      .$promise.then((data) => {
        this.subServicesTerms = data;
      })
      .catch((err) => {
        this.subServicesTermsError = true;
        return new this.TucToastError(err);
      })
      .finally(() => {
        this.subServicesTermsLoading = false;
      });
  }

  /**
   * Validator for the resiliationDate
   * @param {Date} specifiedDate Date to validate
   */
  checkDate() {
    return (
      !this.model.when ||
      moment(this.model.when).isSame(this.minResiliationDate) ||
      moment(this.model.when).isAfter(this.minResiliationDate)
    );
  }

  /**
   * Get the current currency symbol
   *
   * @return promise with the symbol of the current currency
   */
  getCurrentCurrencySymbol() {
    return this.$q
      .when(this.coreConfig.getUser())
      .then((me) => (me && me.currency ? me.currency.symbol : ''));
  }

  /**
   * Apply the state of the global checkbox to all the sub checkbox if needed
   * @param {String} the type of the service
   */
  switchApply(serviceType) {
    let isUpdated = false;
    angular.forEach(this.subServicesTerms[serviceType], (service) => {
      if (service.keepServiceTerms.isAllowed) {
        this.model.subServicesToKeep[service.id] = this.switch[serviceType];
        isUpdated = true;
      }
    });

    if (isUpdated) {
      this.updateFeeSummary();
    } else {
      this.$timeout(() => {
        this.switch[serviceType] = !this.switch[serviceType];
      }, 200);
    }
  }

  /**
   * Update the fee summary
   */
  updateFeeSummary() {
    this.feeSummary = {
      duePrice: get(this, 'resiliationTerms.data.due'),
      keepingPrice: 0.0,
      renewPrice: {},
    };

    this.config.orderedServicesToList.forEach((serviceType) => {
      if (this.subServicesTerms && this.subServicesTerms[serviceType]) {
        this.subServicesTerms[serviceType].forEach((service) => {
          angular.forEach(this.model.subServicesToKeep, (go, serviceId) => {
            let key;

            // the key of the Object is a stringified service id
            if (go && String(service.id) === serviceId) {
              key = service.keepServiceTerms.renewPeriod.toString();

              // [IEEE 754]: store int to avoid flotting point number storage problem
              this.feeSummary.keepingPrice +=
                service.keepServiceTerms.price.value * 100;

              if (this.feeSummary.renewPrice[key] === undefined) {
                this.feeSummary.renewPrice[key] = 0;
              }

              this.feeSummary.renewPrice[key] +=
                service.keepServiceTerms.renewPrice.value * 100;
            }
          });
        });
      }
    });

    // [IEEE 754]: restore real value: Int -> float (.2)
    this.feeSummary.keepingPrice = this.feeSummary.keepingPrice
      ? Number(this.feeSummary.keepingPrice / 100).toFixed(2)
      : '0';
    angular.forEach(this.feeSummary.renewPrice, (value, key) => {
      this.feeSummary.renewPrice[key] = Number(
        this.feeSummary.renewPrice[key] / 100,
      ).toFixed(2);
    });

    this.getCurrentCurrencySymbol().then((currency) => {
      this.feeSummary.currency = currency;
    });
  }

  /**
   * Check the state of the global checkbox
   * @param {String} the type of the service
   */
  checkSwitchState(serviceType) {
    for (
      let i = 0, imax = this.subServicesTerms[serviceType].length;
      i < imax && this.switch[serviceType];
      i += 1
    ) {
      const service = this.subServicesTerms[serviceType][i];
      if (
        service.keepServiceTerms.isAllowed &&
        !this.model.subServicesToKeep[service.id]
      ) {
        this.switch[serviceType] = false;
      }
    }
  }

  /**
   * Check/update all things depending of the checked sub services
   * @param {String} the type of the service
   */
  updateAllInfluencedByCheckedSubServices(serviceType) {
    this.checkSwitchState(serviceType);
    this.updateFeeSummary();
  }

  /**
   * True if serviceType has at least one sub service allowed to be kept,
   * false otherwise.
   */
  hasKeepableSubServices(serviceType) {
    return some(this.subServicesTerms[serviceType], (service) =>
      get(service, 'keepServiceTerms.isAllowed'),
    );
  }

  /**
   * Compute the new price according to the new date
   * @returns {*}
   */
  computePrice() {
    this.computingPrice = true;
    return this.OvhApiPackXdslResiliation.v6()
      .resiliationTerms(
        {
          packName: this.$stateParams.packName,
          resiliationDate: this.model.when
            ? this.model.when.toISOString()
            : null,
        },
        null,
      )
      .$promise.then(
        (data) => {
          this.resiliationTerms.data.due = data.due;
          this.updateFeeSummary();
        },
        (err) => new this.TucToastError(err),
      )
      .finally(() => {
        this.computingPrice = false;
      });
  }

  /**
   * Open the date picker
   * @param event
   */
  openDatePicker(event) {
    this.pickerOpened = true;
    this.pickerOpenedPreventConflict = true;
    event.stopPropagation();

    this.$timeout(() => {
      this.pickerOpenedPreventConflict = false;
    }, 500);
  }

  /**
   * Switch the date picker state, if is open then close,
   * if is closed then open it
   *
   * @param event
   */
  switchDatePickerState(event) {
    if (!this.pickerOpenedPreventConflict) {
      this.pickerOpened = !this.pickerOpened;
    }

    event.stopPropagation();
  }

  /**
   * Resiliate a pack
   * @param  {Object} pack   Pack to resiliate
   * @param  {Object} survey Reason to resiliate
   * @param {Boolean} accept If true the resiliation must be done
   */
  resiliatePack() {
    this.loading = true;

    return this.OvhApiPackXdslResiliation.v6()
      .resiliate(
        {
          packName: this.$stateParams.packName,
        },
        {
          resiliationSurvey: {
            type: this.model.reason.value,
            comment: this.model.comment ? this.model.comment : null,
            subsidiary: this.isSubsidiaryQuestion
              ? this.model.subsidiary
              : null,
          },
          resiliationDate: this.model.when
            ? this.model.when.toISOString()
            : null,
          servicesToKeep: remove(
            map(this.model.subServicesToKeep, (value, key) =>
              value ? key : null,
            ),
            null,
          ),
        },
      )
      .$promise.then(() => {
        set(this.resiliationNotification, 'success', true);
        this.$state.go('telecom.packs.pack', {
          packName: this.$stateParams.packName,
        });
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.loading = false;
      });
  }

  /**
   * Cancel an on-going resiliation
   * @param  {Object} pack Pack to cancel resiliation
   */
  cancelPackResiliation(pack) {
    this.loading = true;
    return this.OvhApiPackXdslResiliation.v6()
      .cancelResiliation(
        {
          packName: pack.packName,
        },
        null,
      )
      .$promise.then(
        () => {
          set(this.resiliationNotification, 'cancelSuccess', true);
          this.$state.go('telecom.packs.pack', {
            packName: this.$stateParams.packName,
          });
        },
        (err) => new this.TucToastError(err),
      )
      .finally(() => {
        this.loading = false;
      });
  }

  openConfirmation() {
    const self = this;
    this.$uibModal
      .open({
        template: this.$templateCache.get('resiliation.modal.html'),
        controllerAs: 'ResiliationModelCtrl',
        controller(subject) {
          'ngInject';

          this.resiliation = { confirm: {} };
          this.subject = subject;
        },
        resolve: {
          subject() {
            return self.resiliationReason;
          },
        },
      })
      .result.then((result) => {
        switch (result) {
          case 'cancel':
            this.$uibModal.close();
            break;
          default:
            this.resiliatePack();
            break;
        }
        return result;
      });
  }

  checkNeedSubsidiaryQuestion() {
    this.isSubsidiaryQuestion = [
      'technicalProblems',
      'eligibilityFtth',
      'changeOperator',
    ].includes(this.model.reason.value);
  }

  /**
   * Retrieve access name, access type and launch eligibility if not fiber access
   */
  checkForEligibility() {
    this.$http
      .get(`/pack/xdsl/${this.$stateParams.packName}/xdslAccess/services`)
      .then(({ data }) => {
        if (data.length > 0) {
          const accessName = data[0];
          this.$http.get(`/xdsl/${accessName}`).then((response) => {
            const { accessType } = response.data;
            if (['vdsl', 'adsl'].includes(accessType)) {
              this.$http
                .get(`/xdsl/${accessName}/fiberEligibilities`)
                .then((result) => {
                  if (result.data.length > 0) {
                    const id = result.data[0];
                    this.$http
                      .get(`/xdsl/${accessName}/fiberEligibilities/${id}`)
                      .then((res) => {
                        this.eligibility = res.data;
                        this.isEligible =
                          this.eligibility.status === this.STATUS.eligible;
                        this.isEligibleNotYet =
                          this.eligibility.status ===
                          this.STATUS.notYetEligible;
                      });
                  }
                });
            }
          });
        }
      });
  }

  /**
   * Close modal
   */
  onDismiss() {
    if (this.isEligible) {
      this.isEligible = false;
    }
    if (this.isEligibleNotYet) {
      this.isEligibleNotYet = false;
    }
  }

  /**
   * Go to change offer page
   */
  onChangeOffer() {
    this.$state.go('telecom.packs.pack.migration', {
      packName: this.$stateParams.packName,
    });
  }

  static formatDate(dateToFormat) {
    return moment(dateToFormat).format('DD/MM/YYYY');
  }

  static openFiberPage() {
    window.open(URL_PRO_FIBER, '_blank', 'noopener');
  }
}
