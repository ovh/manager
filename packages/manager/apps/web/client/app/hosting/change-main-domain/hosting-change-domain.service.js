angular.module('App').service('hostingChangeDomain', function hostingChangeDomain(OvhHttp) {
  this.getAllowedDurations = (serviceName, opts) => OvhHttp.get('/order/hosting/web/{serviceName}/changeMainDomain', {
    rootPath: 'apiv6',
    urlParams: {
      serviceName,
    },
    params: {
      domain: opts.domain,
      mxplan: opts.mxplan,
    },
  });

  this.get = (serviceName, opts) => OvhHttp.get(
    '/order/hosting/web/{serviceName}/changeMainDomain/{duration}',
    {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
        duration: opts.duration,
      },
      params: {
        domain: opts.domain,
        mxplan: opts.mxplan,
      },
    },
  );

  this.post = (serviceName, opts) => OvhHttp.post(
    '/order/hosting/web/{serviceName}/changeMainDomain/{duration}',
    {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
        duration: opts.duration,
      },
      data: {
        domain: opts.domain,
        mxplan: opts.mxplan,
      },
    },
  );

  this.getModels = () => OvhHttp.get('/order.json', {
    rootPath: 'apiv6',
  }).then(data => data.models);
});
