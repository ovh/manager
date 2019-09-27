angular
  .module('Billing.services')
  .service('BillingTerminate', function BillingTerminate($q, OvhHttp) {
    this.getServiceTypeFromPrefix = function getServiceTypeFromPrefix(serviceApiPrefix) {
      return serviceApiPrefix
        .replace(/^\//, '')
        .replace(/\/\{.+$/, '')
        .replace(/\//g, '_');
    };

    this.getServiceApi = function getServiceApi(serviceId, forceRefresh) {
      const params = {
        rootPath: 'apiv6',
        cache: 'billingTerminateService',
      };
      if (forceRefresh) {
        delete params.cache;
      }
      return OvhHttp.get(`/service/${serviceId}`, params);
    };

    this.getServiceInfo = function getServiceInfo(serviceId) {
      let serviceType;
      return this.getServiceApi(serviceId)
        .then((serviceApi) => {
          serviceType = this.getServiceTypeFromPrefix(serviceApi.route.path);
          return serviceApi.route.url;
        })
        .then(url => OvhHttp.get(`${url}/serviceInfos`, {
          rootPath: 'apiv6',
        }))
        .then(serviceInfos => Object.assign({}, serviceInfos, {
          serviceType,
        }));
    };

    this.confirmTermination = function confirmTermination(
      serviceId,
      serviceName,
      futureUse,
      reason,
      commentary,
      token,
    ) {
      return this.getServiceApi(serviceId)
        .then(serviceApi => serviceApi.route.url)
        .then(url => OvhHttp.post(`${url}/confirmTermination`, {
          rootPath: 'apiv6',
          data: {
            reason,
            commentary,
            token,
          },
        }));
    };
  });
