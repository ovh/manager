/* eslint-disable no-use-before-define */
/**
 * @ngdoc controller
 * @name Billing.controller:AutoRenewCtrl
 * @description
 * Autorenew services configuration
 */
angular.module('Billing.controllers').controller('Billing.controllers.AutoRenew', [
  '$filter',
  '$location',
  '$q',
  '$rootScope',
  '$scope',
  '$timeout',
  '$translate',
  '$uibModal',
  '$window',
  'Alerter',
  'atInternet',
  'Billing.URLS',
  'BillingAutoRenew',
  'billingRenewHelper',
  'constants',
  'coreConfig',
  'ovhPaymentMethod',
  'User',
  'AUTORENEW_EVENT',
  'BILLING_BASE_URL',
  'DEBT_STATUS',
  'DOMAINS_AUTORENEW_BATCH_CERTIFICATE',
  'SUBSIDIARIES_WITH_RECENT_AUTORENEW',

  function (
    $filter,
    $location,
    $q,
    $rootScope,
    $scope,
    $timeout,
    $translate,
    $uibModal,
    $window,
    Alerter,
    atInternet,
    billingUrls,
    AutoRenew,
    renewHelper,
    constants,
    coreConfig,
    ovhPaymentMethod,
    User,
    AUTORENEW_EVENT,
    BILLING_BASE_URL,
    DEBT_STATUS,
    DOMAINS_AUTORENEW_BATCH_CERTIFICATE,
    SUBSIDIARIES_WITH_RECENT_AUTORENEW,
  ) {
    /**
     * Parse exchange name and determine it's type based on name prefix. Defaults on hosted type.
     * exchange-xxx-xxx = type provider
     * hosted-xxx-xxx = type hosted
     * private-xxx-xxx = type dedicated
     */
    function getExchangeType(offer) {
      return `exchange_${offer.toLowerCase()}`;
    }

    const ALL_SERVICE_TYPES = {
      key: 'ALL',
      text: $translate.instant('autorenew_service_type_ALL'),
    };

    $scope.loaded = false;
    $scope.user = null;
    $scope.expandHostingDomain = {};
    $scope.urls = {
      renewAlign: '',
    };
    $scope.searchText = {
      value: '',
    };
    $scope.nbServices = 0;
    $scope.serviceToKeep = null;

    $scope.renewFilter = {
      model: 'months',
      values: [0, 'weeks', 'months', 'expired', 'renew_month'],
    };

    $scope.nicBillingFilter = {
      model: null,
      values: [],
    };

    $rootScope.$on(AUTORENEW_EVENT.TERMINATE_AT_EXPIRATION, () => {
      $scope.mustDisplayDeleteAtExpirationCancellingBanner = true;
    });

    $rootScope.$on(AUTORENEW_EVENT.CANCEL_TERMINATE, (event, service) => {
      const firstService = _(service).isArray() ? _(service).head() : service;
      $scope.mustDisplayDeleteAtExpirationCancellingBanner = $scope.mustDisplayDeleteAtExpirationCancellingBanner && firstService.serviceId !== _($scope.serviceToKeep).get('serviceId');
    });

    $scope.renewalFilter = {
      model: '0',
      values: [
        '0',
        'manuel',
        'auto',

        // common frequency values
        'frequency_value_1',
        'frequency_value_3',
        'frequency_value_6',
        'frequency_value_12',
        'frequency_value_24',
        'frequency_value_36',
        'frequency_value_48',
        'delete_at_expiration',
      ],
    };
    $scope.renewalFilter.labels = $scope.renewalFilter.values.reduce((labels, value) => {
      labels[value] = renewHelper.getRenewLabel(value); // eslint-disable-line
      return labels;
    }, {});

    $scope.getRenewLabel = function (renewFilterId) {
      return renewHelper.getRenewLabel(renewFilterId);
    };

    $scope.exportCSV = {
      load: false,
    };

    $scope.automaticRenewV2Mean = {
      available: $scope.worldPart === 'EU',
      allowed: false,
      loading: true,
      closeMean: false,
      noMeanMessageClose() {
        $scope.automaticRenewV2Mean.closeMean = true;
      },
      checkPayment() {
        return !$scope.automaticRenewV2Mean.loading && $scope.automaticRenewV2Mean.allowed;
      },
    };
    $scope.servicesDetails = [];

    $scope.serviceTypeObject = {
      value: ALL_SERVICE_TYPES,
    };

    $scope.nicRenew = {
      renewDays: _.range(1, 30),
      initialized: false,
      active: false,
      renewDay: 1,
      renewDayChanged() {
        return $scope.nicRenew.renewParam
          && $scope.nicRenew.renewDay !== $scope.nicRenew.renewParam.renewDay;
      },
      error: null,
      getNicRenewParam() {
        $scope.nicRenew.loading = true;

        return AutoRenew.getAutorenew()
          .then(({ active, renewDay }) => {
            $scope.nicRenew.active = active;
            $scope.nicRenew.renewDay = renewDay;
          })
          .catch((error) => {
            $scope.nicRenew.active = false;
            $scope.nicRenew.renewDay = 1;
            $scope.nicRenew.error = error.statusText;
          })
          .finally(() => {
            $scope.nicRenew.initialized = true;
            $scope.nicRenew.loading = false;
          });
      },
      setNicRenewParam() {
        $scope.nicRenew.updateLoading = true;
        const { active, renewDay } = $scope.nicRenew;
        const promise = !$scope.nicRenew.initialized
          ? AutoRenew.enableAutorenew(renewDay)
          : AutoRenew.putAutorenew({ active, renewDay });

        return promise
          .catch((error) => {
            $scope.nicRenew.error = error.statusText;
            Alerter.set('alert-danger', $scope.nicRenew.error);
          })
          .finally(() => {
            $scope.nicRenew.updateLoading = false;
          });
      },
    };

    $scope.onAutoRenewChange = function () {
      $scope.nicRenew.setNicRenewParam();
    };

    $scope.BILLING_BASE_URL = BILLING_BASE_URL; // used by menu popover template

    $scope.services = {
      data: null,
      selected: [],
      checkClicked(service) {
        $scope.selected = {
          both: false,
          hasManualRenew: false,
        };

        const isSelected = _.some($scope.services.selected, {
          serviceId: service.serviceId,
          serviceType: service.serviceType,
        });

        if (isSelected) {
          $scope.services.selected = _.filter(
            $scope.services.selected,
            srv => !(srv.serviceId === service.serviceId
              && srv.serviceType === service.serviceType),
          );
        } else {
          $scope.services.selected.push(_.cloneDeep(service));
        }

        const manualServices = $scope.services.selected
          .filter(_service => !renewHelper.serviceHasAutomaticRenew(_service));

        if ($scope.services.selected.length > 0
          && $scope.services.selected.length !== manualServices.length) {
          $scope.selected.both = true;
        }

        $scope.selected.hasManualRenew = !_.isEmpty(manualServices);

        return true;
      },
      lineClicked(service) {
        _.set(service, 'checked', !service.checked);
        $scope.services.checkClicked(service);
      },
      loading: false,
      selectedType: 'ALL',
      readOnlyWarning: false,
      billingWarning: false,
      search: '',
      error: '',
    };

    $scope.gotoExchangeRenew = service => gotoExchangeRenew(service);

    function gotoExchangeRenew(service) {
      const [organization, exchangeName] = service.serviceId.split('/service/');

      if (!exchangeName) {
        return;
      }

      AutoRenew.getExchangeService(organization, exchangeName)
        .then(({ offer, renewOptionAvailable }) => {
          $scope.$emit(AUTORENEW_EVENT.PAY, {
            serviceType: service.serviceType,
            serviceId: `${organization}/${exchangeName}`,
          });

          if (renewOptionAvailable) {
            // UI Boostrap 1.3.3 doesn't support component syntax
            return $uibModal.open({
              controller: 'ExchangeRenewCtrl',
              controllerAs: '$ctrl',
              backdrop: 'static',
              templateUrl: 'account/billing/autoRenew/exchange/exchange-renew.html',
              resolve: {
                organization: () => organization,
                exchangeName: () => exchangeName,
              },
            }).result
              .then((message) => {
                if (message) {
                  Alerter.set('alert-success', message);
                }
              })
              .catch(error => Alerter.set('alert-danger', error));
          }

          const renewUrl = `${getExchangeBaseUrl(organization, exchangeName, offer)}?tab=ACCOUNT`;
          return $window.location.assign(renewUrl);
        });
    }

    $scope.buildSMSCreditBuyingURL = service => `${constants.MANAGER_URLS.telecom}sms/${service.serviceId}/order`;
    $scope.buildSMSAutomaticRenewalURL = service => `${constants.MANAGER_URLS.telecom}sms/${service.serviceId}/options/recredit`;

    /**
     * @doc method
     * @methodOf Billing.controller:AutoRenewCtrl
     * @name Billing.controller:AutoRenewCtrl#getServices
     * @description
     * Load the user services.
     * @param {int} count Number of results by page
     * @param {int} offset Page offset
     */
    $scope.getServices = function (count, offset) {
      $scope.count = count;
      $scope.offset = offset;

      $scope.services.loading = true;
      $scope.services.selected = [];

      const selectedType = $scope.services.selectedType === 'ALL' ? null : $scope.services.selectedType;
      const selectedRenew = $scope.renewFilter.model === 0 || $scope.renewFilter.model === '0' ? null : $scope.renewFilter.model;
      const selectedRenewal = $scope.renewalFilter.model === 0 || $scope.renewalFilter.model === '0' ? null : $scope.renewalFilter.model;
      const selectedOrder = $scope.orderByState;

      return AutoRenew
        .getServices(
          count,
          offset,
          $scope.searchText.value,
          selectedType,
          selectedRenew,
          selectedRenewal,
          JSON.stringify(selectedOrder),
          $scope.nicBillingFilter.model,
        )
        .then((result) => {
          $scope.nbServices = result.count;

          $scope.services.data = result;
          $scope.services.data
            .userSubsidiaryHasRecentAutorenew = _(SUBSIDIARIES_WITH_RECENT_AUTORENEW)
              .includes($scope.user.ovhSubsidiary);

          const userMustApproveAutoRenew = _($scope.services).get('data.userMustApproveAutoRenew', null);
          if (_(userMustApproveAutoRenew).isBoolean()) {
            $scope.services.data.userMustApproveAutoRenew = userMustApproveAutoRenew;
          }

          $scope.nicBillingFilter.values = result.nicBilling;

          checkWarnings($scope.services.data.list.results);

          $scope.services.data.list.results.forEach((service) => {
            // Exchange name is expected to include the organization also
            // in format "organization/exchange"
            if (service.serviceType === 'EXCHANGE' && service.serviceId.split('/').length === 2) {
              // alternativeId is used to display juste the exchange name
              _.set(service, 'alternativeId', service.serviceId.split('/')[1]);
            }

            if (service.serviceType === 'HOSTING_DOMAIN') {
              $scope.expandHostingDomain[service.domain] = false;
            }

            if (!service.renew) {
              _.set(service, 'renew', { automatic: false, forced: false });
            }

            _.set(service, 'renewLabel', renewHelper.getRenewKey(service));
            if ($scope.renewalFilter.values.indexOf(service.renewLabel) === -1) {
              if (service.renewLabel !== '') {
                $scope.renewalFilter.values.push(service.renewLabel);
              }
            }
          });
        })
        .catch((error) => {
          $scope.services.error = error.statusText;
          return $q.reject(error);
        })
        .finally(() => {
          $scope.services.loading = false;
        });
    };

    $scope.$on('billing-autorenew-clean-selection', (event) => {
      event.stopPropagation();
      uncheckAll();
    });

    /**
     * Called by select all checkbox on table header
     */
    $scope.checkboxStateChange = function (state) {
      const newDelegationValue = state !== 0;
      if (!newDelegationValue) {
        uncheckAll();
        return;
      }

      $scope.services.selected = _.chain($scope.services.data.list.results)
        .each((service) => {
          _.set(service, 'checked', true);
        })
        .value();
    };

    $scope.clearSelectedServices = function () {
      uncheckAll();
    };

    $scope.updateServices = function (service) {
      if (service) {
        $scope.services.selected = [service];
      }
      if ($scope.services.selected.length) {
        $scope.setAction('update', {
          services: _.clone($scope.services.selected, true),
          nicRenew: $scope.nicRenew,
          urlRenew: $scope.getRenewUrl(),
        }, 'autoRenew');
      }
    };

    $scope.verifyUserHasAutoRenewRightOnService = function (service) {
      return userIsBillingOrAdmin(service, $scope.user);
    };

    function getServiceToResiliate(service) {
      const serviceToResiliate = [];

      if (service.serviceType === 'HOSTING_DOMAIN') {
        const domainService = angular.copy(service);
        const hostingService = angular.copy(service);

        domainService.serviceType = 'DOMAIN';
        serviceToResiliate.push(domainService);
        hostingService.serviceType = 'HOSTING_WEB';
        serviceToResiliate.push(hostingService);
      } else {
        serviceToResiliate.push(service);
      }

      return serviceToResiliate;
    }

    $scope.resiliateService = function (service) {
      $scope.serviceToKeep = service;
      const serviceToResiliate = getServiceToResiliate(service);

      if (service.status === 'PENDING_DEBT') {
        $scope.setAction('warnPendingDebt', _.clone(service, true), 'autoRenew');
      } else {
        $scope.setAction('delete', _.clone(serviceToResiliate, true), 'autoRenew');
      }
    };

    $scope.cancelDeleteService = function (service) {
      const serviceToResiliate = getServiceToResiliate(service);

      $scope.setAction('cancelDelete', _.clone(serviceToResiliate, true), 'autoRenew');
    };

    /**
     * Select all auto renew services
     */
    $scope.selectAutomatic = function () {
      const autoList = selectByRenewalMode(true);
      $scope.services.selected = _.cloneDeep(autoList);
    };

    /**
     * Select all manual renew services
     */
    $scope.selectManual = function () {
      const manualList = selectByRenewalMode(false);
      $scope.services.selected = _.cloneDeep(manualList);
    };

    function selectByRenewalMode(automatic) {
      return _.chain($scope.services.data.list.results)
        .filter((service) => {
          _.set(service, 'checked', !$scope.editionDisabled(service) && service.renew.automatic === automatic);
          return service.checked;
        })
        .value();
    }

    $scope.$on(AutoRenew.events.AUTORENEW_CHANGED, () => {
      uncheckAll();
      $scope.services.loading = true;

      /** Ugly hack
       * because api is slow to update renew
       */
      const API_UPDATE_DELAY = 3500;
      $timeout(
        () => {
          $scope.nicRenew.getNicRenewParam();

          // $broadcast("paginationServerSide.reload", "serviceTable") doesn't work in that context
          $scope.getServices($scope.count, $scope.offset);
          $scope.services.loading = false;
        },
        API_UPDATE_DELAY,
        true,
      );
    });

    $scope.editionDisabled = function ({ renew: { deleteAtExpiration, manualPayment } }) {
      return deleteAtExpiration || manualPayment;
    };

    $scope.getExpirationClass = function (service) {
      if (renewHelper.serviceHasAutomaticRenew(service)) {
        return '';
      }

      const expDate = moment(service.expiration);
      if (moment().isAfter(expDate)) {
        return 'label label-danger';
      }
      if (
        moment()
          .add(15, 'days')
          .isAfter(expDate)
      ) {
        return 'label label-warning';
      }
      return '';
    };

    $scope.getRenewUrl = function () {
      const subsidiary = _.get($scope, 'user.ovhSubsidiary', false);
      if (!subsidiary || !billingUrls.renew[subsidiary]) {
        return constants.renew.replace('{serviceName}', '');
      }
      const renewUrl = billingUrls.renew[subsidiary];
      return renewUrl.replace('{serviceName}', '');
    };


    $scope.manualRenew = function () {
      const services = $scope.services.selected
        .filter(service => !renewHelper.serviceHasAutomaticRenew(service));
      $scope.$emit(AUTORENEW_EVENT.PAY, services);

      const parameters = _.map(services, 'serviceId');
      $window.open($scope.getRenewUrl() + parameters.join('%20'), '_blank');
    };

    $scope.getDatasToExport = function () {
      $scope.exportCSV.load = true;

      const datasToReturn = [[$translate.instant('autorenew_service_type'), $translate.instant('autorenew_service_name'), $translate.instant('autorenew_service_date'), $translate.instant('autorenew_service_renew_frequency_title')]];

      angular.forEach($scope.services.data.list.results, (service) => {
        datasToReturn.push([$translate.instant(`autorenew_service_type_${service.serviceType}`), service.serviceId, `${renewHelper.getRenewDateFormated(service)} ${$filter('date')(service.expiration, 'mediumDate')}`, service.renewLabel]);
      });

      return datasToReturn;
    };

    $scope.orderByState = {
      predicate: 'expiration',
      reverse: false,
    };

    $scope.order = function (predicate) {
      $scope.orderByState.predicate = predicate;
      $scope.orderByState.reverse = !$scope.orderByState.reverse;
      $scope.$broadcast('paginationServerSide.loadPage', 1, 'serviceTable');
    };

    $scope.terminateHostingWeb = function (service) {
      $scope.setAction('terminateHostingWeb', _.clone([service], true), 'autoRenew');
    };

    $scope.terminateEmail = function (service) {
      $scope.setAction('terminateEmail', _.clone([service], true), 'autoRenew');
    };

    $scope.terminatePrivateDatabase = function (service) {
      $scope.setAction('terminatePrivateDatabase', _.clone([service], true), 'autoRenew');
    };

    $scope.canResiliate = function (service, user) {
      const canDeleteAtExpiration = service.canDeleteAtExpiration
        || (service.service && service.service.canDeleteAtExpiration);
      return canDeleteAtExpiration && userIsBillingOrAdmin(service, user);
    };

    $scope.canCancelResiliation = function (service, user) {
      return service.renew
        && service.renew.deleteAtExpiration
        && !service.renew.manualPayment && userIsBillingOrAdmin(service, user);
    };

    $scope.canEnableAutorenew = function (service) {
      return service.renewalType !== 'oneShot' && service.renew && (service.renew.manualPayment || !service.renew.automatic);
    };

    $scope.enableAutorenew = function (service) {
      if (!$scope.hasDefaultValidPaymentMean) {
        return $scope.setAction('warnPaymentMean', _.clone([service]), 'autoRenew');
      }
      return $scope.setAction('enable', _.clone([service]), 'autoRenew');
    };

    $scope.disableAutorenew = function (service) {
      $scope.setAction('disable', _.clone([service]), 'autoRenew');
    };

    $scope.disableAutorenewForDomains = function () {
      $scope.setAction('disableAutoRenewDomains', null, 'autoRenew');
    };

    $scope.onNicBillingChange = () => {
      $scope.clearSelectedServices();
      $scope.$broadcast('paginationServerSide.loadPage', 1, 'serviceTable');
    };

    $scope.onSelectedTypeChanged = function () {
      const type = $scope.serviceTypeObject.value;
      $scope.services.selectedType = type ? type.key : null;

      $scope.clearSelectedServices();
      $scope.$broadcast('paginationServerSide.loadPage', 1, 'serviceTable');
      $location.search('selectedType', $scope.services.selectedType);
    };

    $scope.onSearchTextChanged = () => {
      $location.search('searchText', $scope.searchText.value);
      $scope.$broadcast('paginationServerSide.loadPage', '1', 'serviceTable');
    };

    $scope.onSelectedrenewChange = () => {
      $scope.clearSelectedServices();
      $scope.$broadcast('paginationServerSide.loadPage', 1, 'serviceTable');
    };

    $scope.onSelectedRenewalChange = () => {
      $scope.clearSelectedServices();
      $scope.$broadcast('paginationServerSide.loadPage', 1, 'serviceTable');
    };

    $scope.trackCSVExport = () => trackCSVExport();
    $scope.isInDebt = service => isInDebt(service);
    $scope.hasAutoRenew = service => renewHelper.serviceHasAutomaticRenew(service);
    $scope.resiliateExchangeService = service => resiliateExchangeService(service);
    $scope.canDisableAutorenew = service => canDisableAutorenew(service);
    $scope.warnAboutDebt = service => warnAboutDebt(service);
    $scope.gotoRenew = service => goToRenew(service);

    /**
         * HELPER FUNCTIONS
         */

    function checkWarnings(services) {
      $scope.services.readOnlyWarning = false;
      $scope.services.billingWarning = false;
      angular.forEach(services, (service) => {
        if (service.renew && service.renew.forced) {
          $scope.services.readOnlyWarning = true;
        }
        _.set(service, 'isUserAllowed', false);
        if ($scope.user) {
          if (userIsBillingOrAdmin(service, $scope.user)) {
            _.set(service, 'isUserAllowed', true);
          } else {
            $scope.services.billingWarning = true;
          }
        }
      });
    }

    /**
     * @param {Object} service
     * @param {Object} user
     * @returns {boolean} true if the user has admin or contact privilege on the service.
     * @private
     */
    function userIsBillingOrAdmin(service, user) {
      return service && Boolean(user
        && (service.contactBilling === user.nichandle || service.contactAdmin === user.nichandle));
    }

    /**
     * Deselects all services
     * @private
     */
    function uncheckAll() {
      if ($scope.services.data.list) {
        angular.forEach($scope.services.data.list.results, (value) => {
          _.set(value, 'checked', false);
        });
      }

      $scope.services.selected = [];
      $scope.selected = {
        both: false,
        hasOnlyForcedRenew: false,
      };
    }

    function trackCSVExport() {
      atInternet.trackClick({
        name: 'export_csv',
        type: 'action',
        chapter1: 'services',
        chapter2: 'export',
      });
    }

    function isInDebt(service) {
      return DEBT_STATUS.includes(service.status);
    }

    function getExchangeBaseUrl(organization, service, offer) {
      const exchangeAbsoluteUrl = coreConfig.getRegion() === 'EU' && constants.UNIVERS !== 'web' ? constants.MANAGER_URLS.web : $window.location.href.replace($window.location.hash, '#/');
      return `${exchangeAbsoluteUrl}configuration/${getExchangeType(offer)}/${organization}/${service}`;
    }

    function getExchangeUrl(organization, service, offer, action) {
      return `${getExchangeBaseUrl(organization, service, offer)}?action=${action}`;
    }

    function resiliateExchangeService({ serviceId }) {
      const [organization, exchangeName] = serviceId.split('/service/');
      return AutoRenew.getExchangeService(organization, exchangeName)
        .then(({ offer }) => $window.location.assign(getExchangeUrl(organization, exchangeName, offer, 'resiliate')));
    }

    function canDisableAutorenew(service) {
      return service.renewalType !== 'automaticForcedProduct'
        && service.renew
        && !service.renew.deleteAtExpiration
        && !service.renew.manualPayment
        && service.renew.automatic
        && !service.renew.forced
        && !['EXCHANGE', 'EMAIL_DOMAIN'].includes(service.serviceType);
    }

    function setServiceTypes(serviceTypes) {
      $scope.servicesTypes = serviceTypes.map(service => ({
        key: service,
        text: $translate.instant(`autorenew_service_type_${service}`),
      }));
      $scope.servicesTypes
        .sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
      $scope.servicesTypes.unshift(ALL_SERVICE_TYPES);

      // sets the model of the type select input.
      $scope.serviceTypeObject.value = $scope.servicesTypes
        .find(({ key }) => key === $scope.services.selectedType);

      if (!$scope.serviceTypeObject.value) {
        $scope.serviceTypeObject.value = ALL_SERVICE_TYPES;
      }
    }

    function warnAboutDebt(service) {
      const warning = isNicBilling($scope.user, service) ? 'debtBeforePaying' : 'warnNicBilling';
      $scope.setAction(warning, _.clone(service, true), 'autoRenew');
    }

    function goToRenew({ serviceType, serviceId }) {
      $scope.$emit(AUTORENEW_EVENT.PAY, {
        serviceType,
        serviceId,
      });
    }

    function isNicBilling(user, service) {
      return _.get(user, 'nichandle') === _.get(service, 'contactBilling');
    }

    /**
     * INITIALIZATION
     */

    function init() {
      $scope.initLoading = true;

      const {
        selectedType, searchText, renewFilter, renewalFilter, order,
      } = $location.search();

      $scope.services.selectedType = selectedType;
      $scope.searchText = {
        value: searchText,
      };
      $scope.renewFilter.model = renewFilter === '0' ? 0 : renewFilter || 0;
      $scope.renewalFilter.model = renewalFilter === '0' ? '0' : renewalFilter || '0';

      $scope.orderByState.predicate = order ? order.split('::')[0] : 'expiration';
      $scope.orderByState.reverse = order ? order.split('::')[1] === 'true' : false;

      $scope.canDisableAllDomains = false;

      $scope.$broadcast('paginationServerSide.loadPage', '1', 'serviceTable');

      return $q
        .all({
          user: User.getUser(),
          hasDefaultValidPaymentMean: ovhPaymentMethod.hasDefaultPaymentMethod(),
          renewAlignUrl: User.getUrlOf('renewAlign'),
          userGuide: User.getUrlOf('guides'),
          serviceTypes: AutoRenew.getServicesTypes(),
          userCertificates: AutoRenew.getUserCertificates(),
        })
        .then(({
          user,
          hasDefaultValidPaymentMean,
          renewAlignUrl,
          userGuide,
          serviceTypes,
          userCertificates,
        }) => {
          $scope.user = user;
          $scope.urls.renewAlign = renewAlignUrl;
          $scope.canDisableAllDomains = userCertificates
            .includes(DOMAINS_AUTORENEW_BATCH_CERTIFICATE);
          $scope.hasDefaultValidPaymentMean = hasDefaultValidPaymentMean;
          $scope.automaticRenewV2Mean.allowed = hasDefaultValidPaymentMean;

          if (_.has(userGuide, 'autoRenew')) {
            $scope.guide = userGuide.autoRenew;
          }

          setServiceTypes(serviceTypes);

          return $scope.getServices($scope.count, $scope.offset);
        })
        .then(() => $scope.nicRenew.getNicRenewParam())
        .finally(() => {
          $scope.initLoading = false;
          $scope.automaticRenewV2Mean.loading = false;
        });
    }

    init();
  },
]);
/* eslint-enable no-use-before-define */
