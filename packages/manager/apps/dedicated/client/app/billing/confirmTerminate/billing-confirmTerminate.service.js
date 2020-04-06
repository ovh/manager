export default class BillingTerminate {
  /* @ngInject */
  constructor(OvhHttp) {
    this.OvhHttp = OvhHttp;
  }

  // eslint-disable-next-line class-methods-use-this
  getServiceTypeFromPrefix(serviceApiPrefix) {
    return serviceApiPrefix
      .replace(/^\//, '')
      .replace(/\/\{.+$/, '')
      .replace(/\//g, '_');
  }

  getServiceApi(serviceId, forceRefresh) {
    const params = {
      rootPath: 'apiv6',
      cache: 'billingTerminateService',
    };
    if (forceRefresh) {
      delete params.cache;
    }
    return this.OvhHttp.get(`/service/${serviceId}`, params);
  }

  getServiceInfo(serviceId) {
    let serviceType;
    return this.getServiceApi(serviceId)
      .then((serviceApi) => {
        serviceType = this.getServiceTypeFromPrefix(serviceApi.route.path);
        return serviceApi.route.url.replace(
          serviceApi.resource.name,
          window.encodeURIComponent(serviceApi.resource.name),
        );
      })
      .then((url) =>
        this.OvhHttp.get(`${url}/serviceInfos`, {
          rootPath: 'apiv6',
        }),
      )
      .then((serviceInfos) => ({ ...serviceInfos, serviceType }));
  }

  confirmTermination(
    serviceId,
    serviceName,
    futureUse,
    reason,
    commentary,
    token,
  ) {
    return this.getServiceApi(serviceId)
      .then((serviceApi) =>
        serviceApi.route.url.replace(
          serviceApi.resource.name,
          window.encodeURIComponent(serviceApi.resource.name),
        ),
      )
      .then((url) =>
        this.OvhHttp.post(`${url}/confirmTermination`, {
          rootPath: 'apiv6',
          data: {
            reason,
            commentary,
            token,
          },
        }),
      );
  }
}
