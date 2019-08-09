angular.module('services').service('ServerFirewallAsa', function (OvhHttp, $q) {
  const self = this;

  this.events = {
    firewallAsaChanged: 'dedicated.tabs.firewall.asa.reload',
  };

  /**
   * Get options list
   */
  this.getInformations = function (serviceName) {
    return OvhHttp
      .get('/dedicated/server/{serviceName}/features/firewall', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        returnErrorKey: '',
      })
      .then((firewall) => {
        _.set(firewall, 'mode', _.snakeCase(firewall.mode).toUpperCase());
        return firewall;
      })
      .catch((err) => {
        if (err.status === 404) {
          return {};
        }
        return $q.reject(err);
      });
  };

  /**
   * Get options list
   */
  this.getOptionList = function (serviceName) {
    return OvhHttp.get('/sws/dedicated/server/{serviceName}/firewallAsa/options', {
      rootPath: '2api',
      urlParams: {
        serviceName,
      },
    });
  };

  /**
   * Order the option
   */
  this.orderOption = function (serviceName, model, duration) {
    return OvhHttp.post('/order/dedicated/server/{serviceName}/firewall/{duration}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
        duration,
      },
      data: {
        firewallModel: _.camelCase(model),
      },
    });
  };

  /**
   * change the state
   */
  this.changeFirewallState = function (serviceName, enabled) {
    return OvhHttp.put('/dedicated/server/{serviceName}/features/firewall', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        enabled,
      },
      broadcast: self.events.firewallAsaChanged,
    });
  };
});
