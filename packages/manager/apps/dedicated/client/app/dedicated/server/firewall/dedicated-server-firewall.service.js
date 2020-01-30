import camelCase from 'lodash/camelCase';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';

angular
  .module('services')
  .service('ServerFirewallAsa', function ServerFirewallAsa(OvhHttp, $q) {
    const self = this;

    this.events = {
      firewallAsaChanged: 'dedicated.tabs.firewall.asa.reload',
    };

    /**
     * Get options list
     */
    this.getInformations = function getInformations(serviceName) {
      return OvhHttp.get('/dedicated/server/{serviceName}/features/firewall', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        returnErrorKey: '',
      })
        .then((firewall) => {
          set(firewall, 'mode', snakeCase(firewall.mode).toUpperCase());
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
    this.getOptionList = function getOptionList(serviceName) {
      return OvhHttp.get(
        '/sws/dedicated/server/{serviceName}/firewallAsa/options',
        {
          rootPath: '2api',
          urlParams: {
            serviceName,
          },
        },
      );
    };

    /**
     * Order the option
     */
    this.orderOption = function orderOption(serviceName, model, duration) {
      return OvhHttp.post(
        '/order/dedicated/server/{serviceName}/firewall/{duration}',
        {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
            duration,
          },
          data: {
            firewallModel: camelCase(model),
          },
        },
      );
    };

    /**
     * change the state
     */
    this.changeFirewallState = function changeFirewallState(
      serviceName,
      enabled,
    ) {
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
