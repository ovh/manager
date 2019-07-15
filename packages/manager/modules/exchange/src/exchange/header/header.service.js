angular
  .module('Module.exchange.services')
  .service('exchangeHeader', class {
    constructor(OvhHttp) {
      this.OvhHttp = OvhHttp;
    }

    updateServiceDisplayName(organizationName, exchangeService, displayName) {
      return this.OvhHttp.put(`/email/exchange/${organizationName}/service/${exchangeService}`, {
        rootPath: 'apiv6',
        data: {
          displayName,
        },
      });
    }
  });
