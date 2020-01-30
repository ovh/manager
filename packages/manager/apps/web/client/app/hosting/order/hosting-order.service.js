angular.module('services').service(
  'HostingOrder',
  class HostingOrder {
    /**
     * Constructor
     * @param WucApi
     * @param constants
     */
    constructor(WucApi, constants) {
      this.WucApi = WucApi;
      this.constants = constants;
      this.proxyPass = `${constants.swsProxyRootPath}order/hosting/web`;
    }

    getDurations(domain, offer, dnsZone) {
      return this.WucApi.get(`${this.proxyPass}/new`, {
        params: {
          dnsZone,
          domain,
          offer,
        },
      });
    }

    get(domain, offer, dnsZone, duration, module) {
      const parameters = {
        domain,
        offer,
      };
      if (dnsZone) {
        parameters.dnsZone = dnsZone;
      }
      if (module) {
        parameters.module = module;
      }
      return this.WucApi.get(`${this.proxyPass}/new/${duration}`, {
        params: parameters,
      });
    }

    post(domain, offer, dnsZone, duration, module) {
      const parameters = {
        domain,
        offer,
      };
      if (dnsZone) {
        parameters.dnsZone = dnsZone;
      }
      if (module) {
        parameters.module = module;
      }
      return this.WucApi.post(`${this.proxyPass}/new/${duration}`, {
        data: parameters,
      });
    }

    getModels() {
      return this.WucApi.get(
        `${this.constants.swsProxyRootPath}order.json`,
      ).then((data) => data.models);
    }
  },
);
