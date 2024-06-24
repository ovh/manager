import { isInternalDns } from './components/add-dns-forms/add-dns-form/add-dns-form.constants';
import {
  COMPONENTS_PATH_PREFIX,
  CONFIGURATION_TYPES,
  ERRORS,
  OPERATIONS,
  STATUS,
} from './domain-dns-modify.constants';

export default class DomainDnsModifyCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $filter,
    $q,
    $state,
    $stateParams,
    $translate,
    Domain,
    WucUser,
    WucValidator,
    Alerter,
  ) {
    this.$scope = $scope;
    this.$filter = $filter;
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Domain = Domain;
    this.WucUser = WucUser;
    this.WucValidator = WucValidator;

    // Watch for changes in modifiedDnsList
    this.$scope.$watch(
      () => this.modifiedDnsList,
      () => {
        this.$scope.alerts.update = null;
        this.canSubmit = this.checkCanSubmit();
      },
      true, // Deep watch for array/object changes
    );
  }

  $onInit() {
    this.$scope.alerts = {
      main: null,
      update: null,
    };
    this.constants = {
      CONFIGURATION_TYPES,
      COMPONENTS_PATH_PREFIX,
    };
    this.dns = {
      original: [],
      originalNames: [],
      registryConfiguration: null,
    };
    this.links = {
      zoneActivate: this.$state.href(
        'app.domain.product.zone.activate',
        this.$stateParams,
      ),
    };
    this.zone = null;
    this.selectedConfigurationType = CONFIGURATION_TYPES.EMPTY;
    this.isLoading = true;
    this.showCancelModificationsButton = true;
    this.canSubmit = false;

    this.init();
    this.initFormControls();
  }

  initFormControls() {
    this.modifiedDnsList = [];
    this.isValidationModalOpened = false;
  }

  init() {
    return this.$q
      .all([this.getResource(), this.getZone(), this.getDomain()])
      .then(([resource]) => {
        this.setCurrentDns(resource);
        this.setDnsRegistryConfiguration(resource);
        this.checkOperationOngoing(resource);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getZone() {
    return this.Domain.getZoneByZoneName(this.$stateParams.productId)
      .then((zone) => {
        this.zone = zone;
      })
      .catch((error) => {
        if (error?.class === ERRORS.NOT_FOUND) {
          return; // Here, a not found error has no interest
        }

        this.$scope.alerts.main = {
          message: 'domain_dns_error_zone_initializing',
          type: 'error',
          data: {
            detail:
              error.data?.message ||
              error.message ||
              ERRORS.UNKNOWN_ERROR_MESSAGE,
          },
        };
      });
  }

  getResource() {
    return this.Domain.getResource(this.$stateParams.productId).catch(
      (error) => {
        this.$scope.alerts.main = {
          message: 'domain_dns_error_initializing',
          type: 'error',
          data: {
            detail:
              error.data?.message ||
              error.message ||
              ERRORS.UNKNOWN_ERROR_MESSAGE,
          },
        };
      },
    );
  }

  getDomain() {
    return this.Domain.getSelected(this.$stateParams.productId).then(
      (domain) => {
        this.domain = domain;
      },
    );
  }

  get isZone() {
    return !!this.zone;
  }

  get isInternalDnssecEnabled() {
    return this.isZone && this.domain?.dnssecStatus === STATUS.ENABLED;
  }

  get showAddForm() {
    return (
      this.modifiedDnsList.length <
      this.dns.registryConfiguration?.maxNumberOfDns
    );
  }

  get hasValidDnsCount() {
    return (
      this.modifiedDnsList.length >=
        this.dns.registryConfiguration?.minNumberOfDns &&
      this.modifiedDnsList.length <=
        this.dns.registryConfiguration?.maxNumberOfDns
    );
  }

  initDnsList() {
    if (this.selectedConfigurationType === CONFIGURATION_TYPES.EXTERNAL) {
      this.setExternalConfig();
    } else {
      this.setInternalConfig();
    }
  }

  setInternalConfig() {
    // Use the name servers from the DNS zone information
    this.modifiedDnsList =
      this.zone?.nameServers.map((ns) => ({
        nameServer: ns,
      })) || [];
  }

  setExternalConfig() {
    this.modifiedDnsList = this.dns.original.filter(
      (ns) => !isInternalDns(ns.nameServer),
    );
  }

  setCurrentDns(resource) {
    resource.currentState.dnsConfiguration.nameServers.forEach((ns) => {
      const nameServer = {
        nameServer: ns.nameServer,
      };
      if (ns.ipv4) {
        nameServer.ip = ns.ipv4;
      } else if (ns.ipv6) {
        nameServer.ip = ns.ipv6;
      }

      // Keep only the host names to remind the customer which ones are in use
      this.dns.originalNames.push(ns.nameServer);
      // Keep the original values to be able to reset the form
      this.dns.original.push(nameServer);
      // Pre-fill the form with existing values
      this.modifiedDnsList.push(nameServer);
    });

    if (this.isZone) {
      const { configurationType } = resource.currentState.dnsConfiguration;
      this.selectedConfigurationType =
        CONFIGURATION_TYPES[configurationType] ?? CONFIGURATION_TYPES.INTERNAL;
    }
  }

  setDnsRegistryConfiguration(resource) {
    const dnsConfig = resource.currentState.dnsConfiguration;
    this.dns.registryConfiguration = {
      minNumberOfDns: dnsConfig.minDNS,
      maxNumberOfDns: dnsConfig.maxDNS,
    };
  }

  openValidationModal() {
    if (!this.hasValidDnsCount) {
      this.$scope.alerts.update = {
        message: 'domain_dns_min_max_number_requirements',
        data: {
          minNumber: this.dns.registryConfiguration?.minNumberOfDns,
          maxNumber: this.dns.registryConfiguration?.maxNumberOfDns,
        },
      };
      return;
    }

    this.isValidationModalOpened = true;
  }

  closeValidationModal() {
    this.isValidationModalOpened = false;
  }

  applyConfiguration() {
    // Fetching again to check if the checksum has change
    return this.getResource()
      .then(({ checksum, targetSpec }) => {
        const nameServers = this.modifiedDnsList.map(({ ip, nameServer }) => {
          const ns = {
            nameServer,
          };
          if (ip) {
            if (this.WucValidator.isValidIpv4(ip)) {
              ns.ipv4 = ip;
            }

            if (this.WucValidator.isValidIpv6(ip)) {
              ns.ipv6 = ip;
            }
          }

          return ns;
        });

        const payload = {
          checksum,
          targetSpec: {
            ...targetSpec,
            dnsConfiguration: {
              nameServers,
            },
          },
        };
        return this.Domain.updateResource(this.$stateParams.productId, payload);
      })
      .then(() => {
        this.goBack({
          isSuccess: true,
        });
      })
      .catch((err) => {
        const errorDetail =
          err.data?.message || err.message || ERRORS.UNKNOWN_ERROR_MESSAGE;
        // We don't translate in the view, because the coding in the view is pretty messy for the error detail.
        const translation = this.$translate.instant(
          'domain_dns_update_error_message',
        );

        this.$scope.alerts.update = translation + errorDetail;
      })
      .finally(() => {
        this.closeValidationModal();
      });
  }

  cancelModifications() {
    this.initDnsList();
  }

  checkOperationOngoing(resource) {
    this.isOperationOngoing = resource.currentTasks?.some(
      (task) =>
        task.type === OPERATIONS.DOMAIN_DNS_UPDATE &&
        (task.status === STATUS.ERROR ||
          task.status === STATUS.PENDING ||
          task.status === STATUS.RUNNING),
    );

    if (this.isOperationOngoing) {
      const href = this.$state.href('app.domain.operation.domain', {
        filter: `[{"field":"domain","comparator":"contains","reference":["${this.$stateParams.productId}"]}]`,
      });

      this.$scope.alerts.main = {
        message: 'domain_dns_error_operation_ongoing',
        type: 'info',
        data: {
          domain: this.$stateParams.productId,
        },
        link: {
          href,
          message: 'domain_dns_error_operation_ongoing_link',
        },
      };
    }
  }

  checkCanSubmit() {
    return this.hasValidDnsCount;
  }

  onRemove(index) {
    this.modifiedDnsList = this.modifiedDnsList.filter(
      (_, idx) => index !== idx,
    );
  }

  onConfigurationTypeChange() {
    this.showCancelModificationsButton =
      this.selectedConfigurationType !== CONFIGURATION_TYPES.INTERNAL;
    this.initDnsList();
  }

  onSubmit(dnsEntry) {
    this.modifiedDnsList.push(dnsEntry);
  }
}
