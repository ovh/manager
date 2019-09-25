import identity from 'lodash/identity';
import pickBy from 'lodash/pickBy';
import set from 'lodash/set';

angular
  .module('Module.otrs.services')
  .service('Module.otrs.services.otrs', [
    'OvhHttp',
    function OtrsOtrsService(OvhHttp) {
      const self = this;
      const cache = {
        models: 'UNIVERS_MODULE_OTRS_MODELS',
        me: 'UNIVERS_MODULE_OTRS_ME',
        vipStatus: 'UNIVERS_MODULE_OTRS_VIP',
        services: 'UNIVERS_MODULE_OTRS_SERVICES',
        services2Api: 'UNIVERS_MODULE_OTRS_SERVICES_2API',
        emails: 'UNIVERS_MODULE_OTRS_EMAILS',
      };

      this.noAvailableService = [];

      // self.createMenu = Menu.init;
      self.isLoaded = false;

      self.init = function init() {
        // self.createMenu();
        self.isLoaded = true;
      };

      this.getModels = function getModels() {
        return OvhHttp.get('/support.json', {
          rootPath: 'apiv6',
          cache: cache.models,
        });
      };

      this.getMe = function getMe() {
        return OvhHttp.get('/me', {
          rootPath: 'apiv6',
          cache: cache.me,
        });
      };

      this.isVIP = function isVIP() {
        return OvhHttp.get('/me/vipStatus', {
          rootPath: 'apiv6',
          cache: cache.vipStatus,
        });
      };

      this.getServices = function getServices(opts) {
        return OvhHttp.get('/products', {
          rootPath: '2api',
          params: opts,
          cache: cache.services,
          clearCache: opts ? opts.forceRefresh : false,
        });
      };

      this.getTickets = function getTickets(filters) {
        if (filters.status === 'archived') {
          set(filters, 'status', null);
          set(filters, 'archived', true);
        }
        return OvhHttp.get('/support/tickets', {
          rootPath: 'apiv6',
          params: pickBy(filters, identity),
        });
      };

      this.getTicket = function getTicket(ticketId) {
        return OvhHttp.get('/support/tickets/{ticketId}', {
          rootPath: 'apiv6',
          urlParams: {
            ticketId,
          },
        });
      };

      this.postTicket = function postTicket(ticket) {
        return OvhHttp.post('/support/tickets/create', {
          rootPath: 'apiv6',
          data: ticket,
        });
      };

      this.closeTicket = function closeTicket(ticketId) {
        return OvhHttp.post('/support/tickets/{ticketId}/close', {
          rootPath: 'apiv6',
          urlParams: {
            ticketId,
          },
          data: {},
        });
      };

      this.replyTicket = function replyTicket(ticketId, body) {
        return OvhHttp.post('/support/tickets/{ticketId}/reply', {
          rootPath: 'apiv6',
          urlParams: {
            ticketId,
          },
          data: {
            body,
          },
        });
      };

      this.getTicketMessages = function getTicketMessages(ticketId) {
        return OvhHttp.get('/support/tickets/{ticketId}/messages', {
          rootPath: 'apiv6',
          urlParams: {
            ticketId,
          },
        });
      };

      this.getEmails = function getEmails(opts) {
        return OvhHttp.get('/me/notification/email/history', {
          rootPath: 'apiv6',
          cache: cache.emails,
          clearAllCache: opts.forceRefresh,
        });
      };

      this.getEmail = function getEmail(emailId) {
        return OvhHttp.get('/me/notification/email/history/{emailId}', {
          rootPath: 'apiv6',
          urlParams: {
            emailId,
          },
        });
      };

      this.getCloudProject = function getCloudProject(serviceName) {
        return OvhHttp.get('/cloud/project/{serviceName}', {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
          },
        });
      };
    },
  ])
  .constant('VIP_CONSTANTS', {
    VIP_PHONE: {
      FR: '09.72.100.100',
    },
  });
