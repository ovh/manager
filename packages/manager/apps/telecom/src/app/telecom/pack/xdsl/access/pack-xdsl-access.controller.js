import assign from 'lodash/assign';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findLast from 'lodash/findLast';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

import {
  XDSL_NO_INCIDENT_CODE,
  XDSL_EXCHANGE_MODEM,
  VDSL_PROFILE,
} from './pack-xdsl-access.constants';

export default class XdslAccessCtrl {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $templateCache,
    $translate,
    $uibModal,
    OvhApiPackXdsl,
    OvhApiXdsl,
    OvhApiXdslDiagnostic,
    OvhApiXdslIps,
    OvhApiXdslLines,
    OvhApiXdslLinesDslamPort,
    OvhApiXdslModem,
    OvhApiXdslNotifications,
    TucToast,
    TucToastError,
    XdslTaskPoller,
    PACK,
    PACK_IP,
    REDIRECT_URLS,
    URLS,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$templateCache = $templateCache;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.OvhApiXdsl = OvhApiXdsl;
    this.OvhApiXdslDiagnostic = OvhApiXdslDiagnostic.v6();
    this.OvhApiXdslIps = OvhApiXdslIps;
    this.OvhApiXdslLines = OvhApiXdslLines;
    this.OvhApiXdslLinesDslamPort = OvhApiXdslLinesDslamPort;
    this.OvhApiXdslModem = OvhApiXdslModem;
    this.OvhApiXdslNotifications = OvhApiXdslNotifications;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
    this.XdslTaskPoller = XdslTaskPoller;
    this.PACK = PACK;
    this.PACK_IP = PACK_IP;
    this.REDIRECT_URLS = REDIRECT_URLS;
    this.URLS = URLS;
  }

  $onInit() {
    this.packName = this.$stateParams.packName;
    this.number = this.$stateParams.number;

    this.$scope.loaders = {
      details: true,
      tasks: true,
      deconsolidation: true,
      xdsl: true,
      accessDiagnosticLaunched: false,
      incident: true,
    };

    this.accessDiagnostic = null;

    this.$scope.access = {
      xdsl: null,
      tasks: { current: {} },
      brandName: null,
      isZyxel: false,
    };

    this.$scope.constants = {
      rangeOfBaseIpv4IP: this.PACK_IP.baseIpv4Range,
    };

    this.initTemplateCaches();

    this.$scope.notificationsChanged = (elements) => {
      if (this.$scope.access) {
        this.$scope.access.notificationsCount = elements.length;
      }
    };

    this.$scope.$on('changeAccessNameEvent', (event, data) => {
      if (this.$scope.access.xdsl.accessName === data.xdslId) {
        this.$scope.access.xdsl.description = data.description;
      }
    });

    /*
      HOW DIAGNOSTIC EVENTS WORK:

      When we open the details modal, it sends a 'accessDiagnosticDetails:get'
      event to retrieve a possibly loaded diagnostic.
      We answer with 'accessDiagnosticDetails:arrived' and the diagnostic (or null)
      as an event argument.
      If the popup wants to relaunch a new one, it sends 'accessDiagnosticDetails:launch'.
      We answer with 'accessDiagnosticDetails:arrived' when the diagnostic is finally there.

      WHY WE DO THIS:

      We use events because the process can be in any state when we arrive
      on the page, and we don't know how long it will take for the diagnostic
      to arrive (it is polled). If the user reloads the page, we lose controller's
      state, so the code must be resilient and work even if we load the page in
      the middle of the process.

      Until the task is finished, the diagnostic we get from
      the API is IRRELEVANT and should not be displayed to the user.
    */
    this.$rootScope.$on('accessDiagnosticDetails:launch', () =>
      this.launchDiagnostic(),
    );

    this.$rootScope.$on('accessDiagnosticDetails:get', () => {
      if (
        !this.accessDiagnostic &&
        !this.$scope.loaders.accessDiagnosticLaunched
      ) {
        this.launchDiagnostic();
      }
      this.$rootScope.$broadcast(
        'accessDiagnosticDetails:arrived',
        this.accessDiagnostic,
      );
    });

    this.diagPollerTicket = this.XdslTaskPoller.register(
      'accessDiagnosticRun',
      () => {
        this.$scope.loaders.accessDiagnosticLaunched = false;
        return this.getDiagnostic();
      },
    );

    this.additionalIpPollerTicket = this.XdslTaskPoller.register(
      'pendingOrderAdditionalIpOption',
      () => {
        this.ordering = false;
        return this.getIps();
      },
    );

    this.$scope.$on('$destroy', () => {
      this.XdslTaskPoller.unregister(this.diagPollerTicket);
      this.XdslTaskPoller.unregister(this.additionalIpPollerTicket);
    });

    return this.$q.all([
      this.getLinesDetails(),
      this.getDiagnostic(),
      this.getIncident(),
      this.getModemExchange(),
      this.getAvailableProfiles(),
    ]);
  }

  isLoading() {
    return (
      this.$scope.loaders.details ||
      this.$scope.loaders.tasks ||
      this.$scope.loaders.incident
    );
  }

  openDetailsPopup() {
    if (
      this.accessDiagnostic === null &&
      !this.$scope.loaders.accessDiagnosticLaunched
    ) {
      this.launchDiagnostic();
    }
    return this.$state.go(
      'telecom.packs.pack.xdsl.line.access-diagnostic-details',
    );
  }

  launchDiagnostic() {
    this.accessDiagnostic = null;
    this.$scope.loaders.accessDiagnosticLaunched = true;
    return this.OvhApiXdslDiagnostic.launchDiagnostic(
      { xdslId: this.$stateParams.serviceName },
      {},
    ).$promise;
  }

  getDiagnostic() {
    return this.OvhApiXdslDiagnostic.get({
      xdslId: this.$stateParams.serviceName,
    }).$promise.then((accessDiagnostic) => {
      this.accessDiagnostic = accessDiagnostic;
      this.$rootScope.$broadcast(
        'accessDiagnosticDetails:arrived',
        this.accessDiagnostic,
      );
    });
  }

  initTemplateCaches() {
    /* eslint-disable max-len */
    this.$templateCache.put(
      'pack-xdsl-access-tooltip-dslam.html',
      '<div class="tooltip-description" data-translate="xdsl_access_dslam_reset_description"></div><div class="text-warning" data-translate="xdsl_access_dslam_reset_warning"></div>',
    );
    this.$templateCache.put(
      'pack-xdsl-access-tooltip-lnsApply.html',
      '<div class="tooltip-description" data-translate="xdsl_access_lns_ratelimit_description"></div><div class="text-warning" data-translate="xdsl_access_lns_ratelimit_warning"></div>',
    );
    this.$templateCache.put(
      'pack-xdsl-access-tooltip-lns.html',
      '<div class="tooltip-description" data-translate="xdsl_access_lns_description"></div><div class="text-warning" data-translate="xdsl_access_lns_warning"></div>',
    );
    this.$templateCache.put(
      'pack-xdsl-access-tooltip-deconsolidation.html',
      '<div class="tooltip-description" data-ng-bind=" (\'xdsl_access_deconsolidation_warning_\' + XdslAccess.lineDetails.deconsolidation) | translate"></div>',
    );
    this.$templateCache.put(
      'pack-xdsl-access-tooltip-ipDelete.html',
      '<div class="tooltip-description" data-translate="xdsl_details_ips_remove_only_extra"></div>',
    );
    this.$templateCache.put(
      'pack-xdsl-access-tooltip-ips.html',
      '<div class="tooltip-description" data-translate="xdsl_access_ipv6_description"></div><div class="text-warning" data-translate="xdsl_access_ipv6_warning"></div>',
    );
    /* eslint-enable max-len */
  }

  setStatusLabel(status) {
    switch (status) {
      case 'active':
        this.statusLabel = `<h5 class="ovh-font ovh-font-success text-success mr-2" aria-hidden="true"></h5> ${this.$translate.instant(
          `xdsl_details_status_${status}`,
        )}`;
        break;
      case 'doing':
      case 'migration':
      case 'upgradeOffer':
        this.statusLabel = `<h5 class="ovh-font ovh-font-success text-success mr-2" aria-hidden="true"></h5> ${this.$translate.instant(
          `xdsl_details_status_${status}`,
        )}`;
        break;
      case 'cancelled':
      case 'close':
      case 'deleting':
      case 'slamming':
        this.statusLabel = `<h5 class="ovh-font ovh-font-failure text-danger mr-2" aria-hidden="true"></h5> ${this.$translate.instant(
          `xdsl_details_status_${status}`,
        )}`;
        break;
      default:
        this.statusLabel = status;
    }
  }

  getOldV6TransfertUrl() {
    return this.REDIRECT_URLS.oldV6ServiceTransfert;
  }

  getIps() {
    return this.OvhApiXdslIps.Aapi()
      .ips({
        xdslId: this.$stateParams.serviceName,
      })
      .$promise.then((ips) => {
        this.ips = ips;
        this.ipsV6 = this.$filter('filter')(ips, { version: 'v6' });
        this.ipsV4 = this.$filter('filter')(ips, { version: 'v4' });
        ips.forEach((ip) => {
          // eslint-disable-next-line no-param-reassign
          ip.getBlock = function getBlock() {
            return `${this.ip}/${this.range}`;
          };
        });
      }, this.TucToastError);
  }

  hasPendingOrderAdditionalIpOption() {
    return this.$scope.access.tasks.current.pendingOrderAdditionalIpOption;
  }

  canHaveMoreIps() {
    return (
      filter(this.ipsV4, (ip) => ip.range !== this.PACK_IP.baseIpv4Range)
        .length === 0
    );
  }

  orderIps() {
    const modal = this.$uibModal.open({
      animation: true,
      templateUrl:
        'app/telecom/pack/xdsl/access/ip/order/pack-xdsl-access-ip-order.modal.html',
      controller: 'XdslAccessIpOrderCtrl',
      controllerAs: 'ctrl',
      resolve: {
        data: () => ({ xdslId: this.$stateParams.serviceName }),
      },
    });
    modal.result.then((result) => {
      this.$scope.access.tasks.current[result.function] = true;
    });
  }

  deleteIps(ip) {
    set(ip, 'deleting', true);
    this.OvhApiXdslIps.v6()
      .unOrder(
        {
          xdslId: this.$stateParams.serviceName,
          ip: ip.ip,
        },
        null,
      )
      .$promise.then(
        () => {
          this.getIps();
          set(ip, 'deleting', false);
          this.TucToast.success(
            this.$translate.instant('xdsl_access_ip_block_delete_success', {
              ip: ip.ip,
            }),
          );
        },
        (err) => {
          set(ip, 'deleting', false);
          this.TucToastError(err);
        },
      );
  }

  onTaskPollError(err) {
    if (!isEmpty(err)) {
      this.TucToastError(err);
    }
    this.$scope.loaders.tasks = false;
  }

  onTaskPollSuccess(result) {
    this.$scope.access.tasks.current = result.data;
    this.$scope.loaders.tasks = false;
  }

  getLinesDetails() {
    this.$scope.loaders.details = true;
    this.$scope.loaders.tasks = true;

    this.transfert = {};

    this.XdslTaskPoller.start(
      this.$stateParams.serviceName,
      this.$scope,
      (result) => this.onTaskPollSuccess(result),
      (error) => this.onTaskPollError(error),
    );

    return this.$q
      .allSettled([
        // Get access Details
        this.OvhApiXdsl.v6()
          .get({
            xdslId: this.$stateParams.serviceName,
          })
          .$promise.then(
            (access) => {
              this.$scope.loaders.xdsl = false;
              this.$scope.access.xdsl = assign(access, {
                isFiber: includes(this.PACK.fiberAccess, access.accessType),
              });
              this.$scope.access.xdsl.isNotSdsl = true;
              if (this.$scope.access.xdsl.accessType === 'sdsl') {
                this.$scope.access.xdsl.isNotSdsl = false;
              }
              this.setStatusLabel(this.$scope.access.xdsl.status);
              return this.$scope.access.xdsl;
            },
            (err) => {
              this.$scope.loaders.xdsl = false;
              return this.TucToastError(err);
            },
          ),

        // Get line details
        this.OvhApiXdslLines.v6()
          .get({
            xdslId: this.$stateParams.serviceName,
            number: this.$stateParams.number,
          })
          .$promise.then(
            (lineDetails) => {
              this.lineDetails = lineDetails;
              this.$scope.deconsolidation = lineDetails.deconsolidation;
              this.$scope.loaders.deconsolidation = false;
            },
            (err) => {
              this.$scope.loaders.deconsolidation = false;
              return this.TucToastError.constructor(err);
            },
          ),

        // Get MAC Address
        this.OvhApiXdslModem.v6()
          .get({
            xdslId: this.$stateParams.serviceName,
          })
          .$promise.then(
            (modemDetail) => {
              this.$scope.access.brandName = modemDetail.brandName;
              if (modemDetail.brandName === 'Zyxel') {
                this.$scope.access.isZyxel = true;
              }
              this.modem = modemDetail;
            },
            (err) => {
              if (err.status === 404) {
                return;
              }
              this.TucToastError(err);
            },
          ),

        this.getIps(),

        // Get notification number
        this.OvhApiXdslNotifications.v6()
          .query({
            xdslId: this.$stateParams.serviceName,
          })
          .$promise.then((ids) => {
            this.$scope.access.notificationsCount = ids.length;
          }, this.TucToastError),

        // Get Order
        this.OvhApiXdsl.v6()
          .getOrder({
            xdslId: this.$stateParams.serviceName,
          })
          .$promise.then((orders) => {
            this.actualOrder = find(
              orders,
              (order) => order.status === 'doing',
            );

            if (!this.actualOrder) {
              this.actualOrder = findLast(
                orders,
                (order) => order.status === 'done',
              );
            }

            if (this.actualOrder.doneDate) {
              this.actualOrder.doneDateLocale = new Date(
                this.actualOrder.doneDate,
              ).toLocaleString();
            }
          }, this.TucToastError),

        this.OvhApiPackXdsl.Task()
          .v6()
          .query({
            packName: this.packName,
            function: 'pendingAddressMove',
          })
          .$promise.then((result) => {
            this.pendingAddressMove = result.length > 0;
          }),
      ])
      .finally(() => {
        this.$scope.loaders.details = false;
      });
  }

  getIncident() {
    return this.OvhApiXdsl.Incident()
      .v6()
      .get({
        serviceName: this.$stateParams.serviceName,
      })
      .$promise.then(() => {
        this.hasIncidentOccured = true;
      })
      .catch((error) => {
        const errorStatus = get(error, 'status');
        if (errorStatus === XDSL_NO_INCIDENT_CODE) {
          this.hasIncidentOccured = false;
        } else {
          this.TucToast.error(
            `${this.$translate.instant(
              'xdsl_details_diagnostic_get_incident_error',
            )} ${get(error, 'data.message', '')}`,
          );
        }
      })
      .finally(() => {
        this.$scope.loaders.incident = false;
      });
  }

  /**
   * Retrieve modem detail for exchange if available
   */
  getModemExchange() {
    return this.OvhApiXdsl.Modem()
      .v6()
      .getComfortExchange({
        xdslId: this.$stateParams.serviceName,
      })
      .$promise.then((result) => {
        this.$scope.access.xdsl.canExchange = true;
        this.$scope.access.xdsl.newModel = result.newModel
          .replace(/\./g, ' ')
          .toUpperCase();
        this.$scope.access.xdsl.priceHT = result.price.value;
        this.$scope.access.xdsl.priceTTC = result.priceWithTax.value;
      })
      .catch((error) => {
        if (error.data.message.includes(XDSL_EXCHANGE_MODEM.errBase)) {
          // It's the last model modem or a RMA is already done
          const typeMessage = error.data.message.substring(0, 6);
          this.$scope.access.xdsl.canExchange = false;
          switch (typeMessage) {
            case XDSL_EXCHANGE_MODEM.errorCodeLast:
              this.$scope.access.xdsl.messageCantExchange =
                'xdsl_modem_comfort_exchange_already_last_model';
              break;
            case XDSL_EXCHANGE_MODEM.errorCodeRMA:
              this.$scope.access.xdsl.messageCantExchange =
                'xdsl_modem_comfort_exchange_already_opened_rma';
              break;
            case XDSL_EXCHANGE_MODEM.errorCodeSDSL:
              this.$scope.access.xdsl.messageCantExchange =
                'xdsl_modem_comfort_exchange_not_replace_modem_sdsl';
              break;
            default:
              this.TucToastError(error.data.message);
              break;
          }
        }
      });
  }

  /**
   * Retrieve available profiles for connection to make tooltip
   */
  getAvailableProfiles() {
    return this.OvhApiXdslLinesDslamPort.Aapi()
      .getProfiles({
        xdslId: this.$stateParams.serviceName,
        number: this.$stateParams.number,
      })
      .$promise.then((profiles) => {
        let profilesTemplate = '';
        profiles.forEach((profile) => {
          if (!profilesTemplate && profile.name.includes('VDSL')) {
            profilesTemplate =
              '<p data-translate="xdsl_access_profile_tooltip_description"></p>';
          }
          if (
            profile.name.includes('VDSL') &&
            (profile.name.includes('SAFE2') ||
              profile.name.includes('PERF1') ||
              profile.name.includes('PERF2'))
          ) {
            let translateVdslValues = '';
            if (profile.name.includes('SAFE2')) {
              translateVdslValues = `{ profile: '${profile.name}', snr: '${VDSL_PROFILE.safe2}' }`;
            } else if (profile.name.includes('PERF1')) {
              translateVdslValues = `{ profile: '${profile.name}', snr: '${VDSL_PROFILE.perf1}' }`;
            } else {
              translateVdslValues = `{ profile: '${profile.name}', snr: '${VDSL_PROFILE.perf2}' }`;
            }

            profilesTemplate = `${profilesTemplate}<p data-translate="xdsl_access_profile_tooltip_vdsl_other" data-translate-values="${translateVdslValues}"></p>`;
          } else {
            const translateValues = `{ profile: '${profile.name}' }`;
            profilesTemplate = `${profilesTemplate}<p data-translate="xdsl_access_profile_tooltip_${profile.name.toLowerCase()}" data-translate-values="${translateValues}"></p>`;
          }
        });
        this.$templateCache.put(
          'pack-xdsl-access-tooltip-dslamProfile.html',
          `<div class="text-left">${profilesTemplate}<p class="text-warning" data-translate="xdsl_access_profile_tooltip_time"></p></div>`,
        );
      });
  }
}
