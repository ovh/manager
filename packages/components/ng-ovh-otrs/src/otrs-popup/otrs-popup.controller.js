import get from 'lodash/get';
import first from 'lodash/first';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import remove from 'lodash/remove';
import times from 'lodash/times';
import values from 'lodash/values';
import snakeCase from 'lodash/snakeCase';

export default /* @ngInject */ function (
  $http,
  $injector,
  $q,
  $rootScope,
  $scope,
  $transitions,
  $translate,
  OvhApiMe,
  OvhApiMeVipStatus,
  OvhApiService,
  OvhApiSupport,
  OtrsPopup,
  OtrsPopupInterventionService,
  OtrsPopupService,
  OTRS_POPUP_API_EXCLUDED,
  OTRS_POPUP_API_EXTRAS_ENDPOINTS,
  OTRS_POPUP_API_ALIASES,
  OTRS_POPUP_ASSISTANCE_ENUM,
  OTRS_POPUP_BILLING_ENUM,
  OTRS_POPUP_CATEGORIES,
  OTRS_POPUP_INCIDENT_ENUM,
  OTRS_POPUP_INTERVENTION_ENUM,
  OTRS_POPUP_SERVICES,
  OTRS_POPUP_UNIVERSES,
  TICKET_CATEGORIES,
) {
  const self = this;
  const OTHER_SERVICE = 'other';

  self.loaders = {
    send: false,
    services: false,
    models: false,
    intervention: false,
  };
  self.currentUser = null;
  self.isVIP = false;
  self.baseUrlTickets = null;
  self.services = [];

  $transitions.onSuccess({}, (transition) => {
    const toParams = transition.params();
    if (toParams.projectId && self.services && self.services.indexOf(toParams.projectId) !== -1) {
      self.ticket.serviceName = toParams.projectId;
    }
  });

  function initFields() {
    self.ticket = {
      body: null,
      serviceName: null,
      subject: null,
      type: null,
    };

    self.universes = get(OTRS_POPUP_UNIVERSES, $rootScope.target, OTRS_POPUP_UNIVERSES.EU);
    [self.selectedUniverse] = self.universes;

    self.intervention = {
      serviceName: null,
      request: 'intervention',
      disk: {
        comment: null,
        disks: [{
          id: 1,
        }],
        inverse: false,
      },
      hasMegaRaid: false,
      slotInfo: {},
      enums: {
        slotID: [],
      },
    };
  }

  function manageAlert(message, type) {
    if (!message) {
      self.alert.visible = false;
      return;
    }

    self.alert.visible = true;
    self.alert.message = message;
    self.alert.type = type;
  }

  self.getServices = () => {
    // hide alert
    manageAlert();

    if (!OtrsPopupService.isOpen() || !this.selectedServiceType) {
      return $q.when([]);
    }

    self.loaders.services = true;
    return new OvhApiService
      .Aapi()
      .query({
        type: get(this.selectedServiceType, 'route'),
        external: false,
      })
      .$promise
      .then((items) => {
        self.ticket.serviceName = null;
        this.services = items;
        this.services.push({
          displayName: $translate.instant('otrs_service_type_other'),
          serviceName: null,
        });
      })
      .catch((err) => {
        manageAlert([($translate.instant('otrs_err_get_infos'), err.data && err.data.message) || ''].join(' '), 'danger');
      })
      .finally(() => {
        self.loaders.services = false;
      });
  };

  /**
     * Send ticket.
     * @return {Promise}
     */
  self.sendTicket = () => {
    // hide alert
    manageAlert();

    if (!self.loaders.send && self.ticket.body) {
      self.loaders.send = true;

      self.ticket.serviceName = get(self.ticket, 'serviceName.serviceName');
      if (self.ticket.serviceName === OTHER_SERVICE) {
        self.ticket.serviceName = '';
        self.ticket.category = TICKET_CATEGORIES.DEFAULT;
      }

      return OvhApiSupport.v6()
        .create(self.ticket).$promise
        .then((data) => {
          initFields();
          self.otrsPopupForm.$setUntouched();
          self.otrsPopupForm.$setPristine();
          $rootScope.$broadcast('ticket.otrs.reload');
          manageAlert($translate.instant('otrs_popup_sent_success', {
            ticketNumber: data.ticketNumber,
            ticketUrl: [self.baseUrlTickets, data.ticketId].join('/'),
          }), 'success');
        })
        .catch((err) => {
          manageAlert([($translate.instant('otrs_popup_sent_error'), err.data && err.data.message) || ''].join(' '), 'danger');
        })
        .finally(() => {
          self.loaders.send = false;
        });
    }

    return $q.when();
  };

  /**
     * Send disk replacement.
     * @return {Promise}
     */
  self.sendDiskReplacement = () => {
    if (!self.loaders.send) {
      self.loaders.send = true;

      return OtrsPopupInterventionService
        .sendDiskReplacement(self.intervention.serviceName.serviceName, self.intervention.disk)
        .then((data) => {
          initFields();
          $rootScope.$broadcast('ticket.otrs.reload');
          manageAlert($translate.instant('otrs_popup_sent_success', {
            ticketNumber: data.ticketNumber,
            ticketUrl: [self.baseUrlTickets, data.ticketId].join('/'),
          }), 'success');
        }).catch((err) => {
          if (includes(err.message, 'This feature is currently not supported in your datacenter')) {
            manageAlert($translate.instant('otrs_popup_sent_error_not_available'), 'danger');
          } else if (includes(err.message, 'Action pending : ticketId ')) {
            const ticketId = /\d+$/.exec(err.message);
            manageAlert($translate.instant('otrs_popup_sent_error_already_exists', {
              ticketUrl: [self.baseUrlTickets, ticketId].join('/'),
            }), 'danger');
          } else {
            manageAlert([
              $translate.instant('otrs_popup_sent_error'),
              get(err, 'message', ''),
            ].join(' '),
            'danger');
          }
        }).finally(() => {
          self.loaders.send = false;
          self.refreshRequests();
          self.setForm('start');
        });
    }

    return $q.when();
  };

  function isSelectedChoiceDedicatedServer() {
    return get(self.selectedServiceType, 'route') === '/dedicated/server';
  }

  self.refreshRequests = () => {
    if (isSelectedChoiceDedicatedServer() && !includes(self.requests, self.intervention.request)) {
      self.requests.push(self.intervention.request);
    } else if (!isSelectedChoiceDedicatedServer()) {
      remove(self.requests, req => self.intervention.request === req);
      self.ticket.category = undefined;
      self.ticket.subcategory = null;
    }
  };

  self.refreshFormDetails = () => {
    if (self.ticket.subcategory === OTRS_POPUP_INTERVENTION_ENUM.REPLACEMENTDISK && self.formDetails === 'message') {
      self.refreshRequests();
      self.setForm('start');
    }
  };

  function getServerInfo() {
    self.loaders.intervention = true;
    self.intervention.canHotSwap = false;
    self.intervention.hasMegaRaid = false;
    self.intervention.slotInfo.canUseSlotId = null;
    self.intervention.slotInfo.slotsCount = 0;
    return OtrsPopupInterventionService
      .getServerInterventionInfo(self.intervention.serviceName.serviceName)
      .then((serverInfo) => {
        self.intervention.canHotSwap = serverInfo.canHotSwap;
        self.intervention.hasMegaRaid = serverInfo.hasMegaRaid;
        self.intervention.slotInfo = serverInfo.slotInfo;
        if (self.intervention.slotInfo.canUseSlotId) {
          self.intervention.enums.slotID = times(self.intervention.slotInfo.slotsCount);
        }
      }).catch(() => {
        manageAlert($translate.instant('otrs_intervention_disk_error'), 'danger');
      }).finally(() => {
        self.loaders.intervention = false;
      });
  }

  self.addDisk = () => {
    const newItemNo = self.intervention.disk.disks.length + 1;
    self.intervention.disk.disks.push({ id: newItemNo });
  };

  self.removeChoice = (item) => {
    self.intervention.disk.disks.splice(item, 1);
  };

  self.setForm = (formDetails) => {
    self.formDetails = formDetails;
  };

  self.isSalesCategory = () => self.ticket.category === OTRS_POPUP_CATEGORIES.SALES;

  self.continueForm = () => {
    if (self.ticket
      && self.ticket.category === OTRS_POPUP_CATEGORIES.INTERVENTION
      && self.ticket.subcategory === OTRS_POPUP_INTERVENTION_ENUM.REPLACEMENTDISK) {
      self.intervention.serviceName = self.ticket.serviceName;
      self.setForm(OTRS_POPUP_INTERVENTION_ENUM.REPLACEMENTDISK);
    } else if (self.ticket
      && self.ticket.category === OTRS_POPUP_CATEGORIES.INTERVENTION
      && self.ticket.subcategory === OTRS_POPUP_INTERVENTION_ENUM.OTHER) {
      self.ticket.category = OTRS_POPUP_CATEGORIES.INCIDENT;
      self.ticket.subcategory = OTRS_POPUP_INCIDENT_ENUM.DOWN;
      self.setForm('message');
    } else {
      self.setForm('message');
    }
  };

  this.$onInit = () => {
    initFields();

    self.alert = {
      visible: false,
      type: null,
      message: null,
    };

    self.servicesValues = OTRS_POPUP_SERVICES;
    self.formDetails = 'start';
    self.interventionEnum = OTRS_POPUP_INTERVENTION_ENUM;

    self.baseUrlTickets = OtrsPopup.getBaseUrlTickets();

    if (isEmpty(self.baseUrlTickets)) {
      throw new Error('A baseUrlTickets must be specified.');
    }

    return $q.all({
      translations: $injector.invoke(/* @ngTranslationsInject ./translations */),
      services: self.getServices(),
      me: OvhApiMe.v6().get().$promise,
      meVipStatus: OvhApiMeVipStatus.v6().get().$promise,
      supportSchema: OvhApiSupport.v6().schema().$promise,
      apiSchema: $http.get('/'),
    }).then((results) => {
      self.currentUser = results.me;

      self.isVIP = values(results.meVipStatus.toJSON()).indexOf(true) !== -1;

      self.types = results.supportSchema.models['support.TicketTypeEnum'].enum;
      self.categories = results.supportSchema.models['support.TicketProductEnum'].enum;
      self.requests = results.supportSchema.models['support.TicketCategoryEnum'].enum;

      if (get(results.me, 'ovhSubsidiary', '').toLowerCase() === 'fr') {
        self.requests.push(OTRS_POPUP_CATEGORIES.SALES);
      }

      self.subCategories = {
        assistance: [
          OTRS_POPUP_ASSISTANCE_ENUM.USAGE,
          OTRS_POPUP_ASSISTANCE_ENUM.START,
        ],
        billing: [
          OTRS_POPUP_BILLING_ENUM.INPROGRESS,
          OTRS_POPUP_BILLING_ENUM.BILL,
          OTRS_POPUP_BILLING_ENUM.AUTORENEW,
        ],
        incident: [
          OTRS_POPUP_INCIDENT_ENUM.PERFS,
          OTRS_POPUP_INCIDENT_ENUM.ALERTS,
          OTRS_POPUP_INCIDENT_ENUM.DOWN,
        ],
        intervention: [
          OTRS_POPUP_INTERVENTION_ENUM.REPLACEMENTDISK,
        ],
      };

      if (self.currentUser.ovhSubsidiary !== 'FR') {
        self.subCategories.assistance.splice(2, 0, OTRS_POPUP_ASSISTANCE_ENUM.NEW);
        self.subCategories.assistance.splice(3, 0, OTRS_POPUP_ASSISTANCE_ENUM.OTHER);
        self.subCategories.billing.splice(1, 0, OTRS_POPUP_ASSISTANCE_ENUM.NEW);
        self.subCategories.billing.splice(3, 0, OTRS_POPUP_ASSISTANCE_ENUM.OTHER);
        self.subCategories.incident.splice(3, 0, OTRS_POPUP_ASSISTANCE_ENUM.OTHER);
      }

      if (self.categories.length === 1) {
        self.ticket.product = first(self.categories);
      }

      $scope.$watch('OtrsPopupCtrl.intervention.serviceName', (server, oldServer) => {
        if (server && server !== oldServer) {
          getServerInfo();
        }
      });

      $scope.$watch('OtrsPopupCtrl.ticket.serviceName', () => {
        self.refreshFormDetails();
        self.refreshRequests();
      });

      $scope.$watch('OtrsPopupCtrl.ticket.subcategory', () => {
        self.refreshFormDetails();
      });

      $scope.$on('otrs.popup.opened', self.getServices);
      $scope.$on('otrs.popup.closed', () => {
        self.services = [];
      });

      this.serviceTypes = get(results, 'apiSchema.data.apis')
        .concat(OTRS_POPUP_API_EXTRAS_ENDPOINTS)
        .filter(api => !includes(OTRS_POPUP_API_EXCLUDED, api.path))
        .map(api => ({
          route: get(OTRS_POPUP_API_ALIASES, api.path, api.path),
          name: $translate.instant(`otrs_service_type_${snakeCase(api.path)}`),
        }));

      this.serviceTypes.push({
        name: $translate.instant('otrs_service_type_other'),
        route: null,
      });
    })
      .catch((err) => { manageAlert([($translate.instant('otrs_err_get_infos'), err.data && err.data.message) || ''].join(' '), 'danger'); })
      .finally(() => { self.loaders.models = false; });
  };
}
