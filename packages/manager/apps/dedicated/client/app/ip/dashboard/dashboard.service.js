import find from 'lodash/find';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import union from 'lodash/union';

export default class {
  /* @ngInject */
  constructor($http, $q, IpRange, OvhHttp, Poll) {
    this.$http = $http;
    this.$q = $q;
    this.OvhHttp = OvhHttp;
    this.Poll = Poll;
    this.IpRange = IpRange;

    this.aapiIpPath = '/sws/module/ip';
    this.swsProxypassPath = 'apiv6';
    this.ipsListDeferredObjs = [];
  }

  getIpDetails(block) {
    return this.$http
      .get(
        [this.swsProxypassPath, 'ip', window.encodeURIComponent(block)].join(
          '/',
        ),
        { cache: true },
      )
      .then((response) => response.data)
      .catch((http) => this.$q.reject(http.data));
  }

  checkTaskUnique(ipBlock, fct) {
    const queue = [];
    let tasks = [];
    angular.forEach(['init', 'doing', 'todo'], (status) => {
      queue.push(
        this.$http
          .get(
            `${this.swsProxypassPath}/ip/${window.encodeURIComponent(
              ipBlock,
            )}/task`,
            {
              params: {
                function: fct,
                status,
              },
            },
          )
          .then((response) => {
            if (response.data && response.data.length) {
              tasks = union(tasks, response.data);
            }
          }),
      );
    });

    return this.$q
      .all(queue)
      .then(() => tasks)
      .catch((http) => this.$q.reject(http.data));
  }

  pollFirewallState(ipBlock, ip) {
    return this.Poll.poll(
      [
        this.swsProxypassPath,
        `ip/${window.encodeURIComponent(ipBlock.ipBlock)}/firewall/${ip.ip}`,
      ].join('/'),
      null,
      { successRule: { state: 'ok' }, namespace: 'ip.firewall' },
    );
  }

  pollMitigationState(ipBlock, ip) {
    return this.Poll.poll(
      [
        this.swsProxypassPath,
        window.encodeURIComponent(
          `ip/${window.encodeURIComponent(ipBlock.ipBlock)}/mitigation/${
            ip.ip
          }`,
        ),
      ].join('/'),
      null,
      { successRule: { state: 'ok' }, namespace: 'ip.mitigation' },
    );
  }

  killPollMitigationState(ipBlock, ip) {
    let pattern;
    if (ipBlock && ip) {
      pattern = {
        url: [
          this.swsProxypassPath,
          window.encodeURIComponent(
            `ip/${window.encodeURIComponent(ipBlock.ipBlock)}/mitigation/${
              ip.ip
            }`,
          ),
        ].join('/'),
      };
    } else {
      pattern = { namespace: 'ip.mitigation' };
    }

    return this.Poll.kill(pattern);
  }

  getServerModels() {
    return this.$http
      .get(`${this.swsProxypassPath}/dedicated/server.json`, { cache: true })
      .then((response) => {
        if (response && response.data && response.data.models) {
          return response.data.models;
        }

        return {};
      })
      .catch((http) => this.$q.reject(http.data));
  }

  getIpModels() {
    return this.$http
      .get(`${this.swsProxypassPath}/ip.json`, { cache: true })
      .then((response) => {
        if (response && response.data && response.data.models) {
          return response.data.models;
        }

        return {};
      })
      .catch((http) => this.$q.reject(http.data));
  }

  getOrderModels() {
    return this.$http
      .get(`${this.swsProxypassPath}/order.json`, { cache: true })
      .then((response) => {
        if (response && response.data && response.data.models) {
          return response.data.models;
        }

        return {};
      })
      .catch((http) => this.$q.reject(http.data));
  }

  getMeModels() {
    return this.$http
      .get(`${this.swsProxypassPath}/me.json`, { cache: true })
      .then((response) => {
        if (response && response.data && response.data.models) {
          return response.data.models;
        }

        return {};
      })
      .catch((http) => this.$q.reject(http.data));
  }

  getNichandleCountryEnum() {
    return this.getMeModels().then(
      (models) => models['nichandle.CountryEnum'].enum,
    );
  }

  getNichandleIpRegistryEnum() {
    return this.getMeModels().then(
      (models) => models['nichandle.IpRegistryEnum'].enum,
    );
  }

  getPriceForParking() {
    return this.$http
      .get(
        [this.swsProxypassPath, 'price/dedicated/server/ip/parking'].join('/'),
        {
          cache: true,
        },
      )
      .then((response) => response.data.text)
      .catch((http) => this.$q.reject(http.data));
  }

  /**
   * Cloud Failover IPs have a subtype: either "cloud" or "ovh".
   *   - subtype "cloud" are IPFOs bought from Cloud manager in a Cloud project
   *   - subtype "ovh" are IPFOs imported into a Cloud project
   */
  getCloudIpSubType(serviceName, ip) {
    const basePath = `${this.swsProxypassPath}/cloud/project/${serviceName}/ip`;
    return this.$http
      .get(basePath, {
        cache: true,
      })
      .then((resp) => {
        const cloudIp = find(resp.data, { ip });
        if (cloudIp && cloudIp.id) {
          return this.$http
            .get(`${basePath}/failover/${cloudIp.id}`, {
              cache: true,
            })
            .then((res) => res.data.subType);
        }
        return null;
      })
      .catch((http) => this.$q.reject(http.data));
  }

  /* ==========================================
     =            DASHBOARD AND SUBS          =
     ========================================== */
  getIpsSanitized(ipBlock, _ips = []) {
    let ips = _ips;

    // If IPV4, generate full list of ips with infos
    if (~ipBlock.indexOf('.')) {
      let ipFromApi;
      const fullIpsList = [];
      const ipv4List = this.IpRange.getRangeForIpv4Block(ipBlock);

      // Loop in the generated ipsv4 list, to have it sorted!
      angular.forEach(ipv4List, (ipv4) => {
        ipFromApi = find(ips, { ip: ipv4 });
        // Not present: create it
        if (!ipFromApi) {
          ipFromApi = {
            ip: ipv4,
            reverse: null,
          };
        }
        fullIpsList.push(ipFromApi);
      });

      ips = fullIpsList;
    }

    // Set default options
    angular.forEach(ips, (ip) => {
      if (!ip.mitigation) {
        set(ip, 'mitigation', 'DEFAULT');
      }
      if (!ip.firewall) {
        set(ip, 'firewall', 'NOT_CONFIGURED');
      }
    });

    return ips;
  }

  killPollFirewallState(ipBlock, ip) {
    let pattern;
    if (ipBlock && ip) {
      pattern = {
        url: [
          this.swsProxypassPath,
          `ip/${window.encodeURIComponent(ipBlock.ipBlock)}/firewall/${ip.ip}`,
        ].join('/'),
      };
    } else {
      pattern = { namespace: 'ip.firewall' };
    }

    return this.Poll.kill(pattern);
  }

  getServicesList() {
    return this.OvhHttp.get('/sws/products/services', {
      rootPath: '2api',
    });
  }

  getIpsForIpBlock(ipBlock, serviceName, serviceType) {
    return this.$http
      .get(`${this.aapiIpPath}/${window.encodeURIComponent(ipBlock)}`, {
        serviceType: 'aapi',
        params: {
          serviceName: serviceName || undefined,
          serviceType: serviceType || undefined,
        },
      })
      .then((response) => this.getIpsSanitized(ipBlock, response.data))
      .then((ips) =>
        map(ips, (ip) => {
          if (ipBlock !== `${ip.ip}/32`) {
            set(ip, 'block', ipBlock);
          }

          return ip;
        }),
      )
      .catch((http) => this.$q.reject(http.data));
  }

  getIpsListForService(serviceName) {
    const deferredObj = this.$q.defer();
    this.ipsListDeferredObjs.push(deferredObj);
    return this.$http
      .get(this.aapiIpPath, {
        serviceType: 'aapi',
        params: {
          serviceName,
        },
        timeout: deferredObj.promise,
      })
      .then((data) => {
        if (data.data && data.data.length) {
          angular.forEach(data.data, (ipBlock) => {
            // Just to be sure
            if (!ipBlock.alerts) {
              set(ipBlock, 'alerts', {});
            }
            if (!ipBlock.ips) {
              set(ipBlock, 'ips', []);
            }
            if (ipBlock.version === 'IPV4') {
              if (/\/32$/.test(ipBlock.ipBlock)) {
                set(ipBlock, 'isUniq', true);
              } else {
                set(ipBlock, 'collapsed', true);
              }
            } else if (/\/128$/.test(ipBlock.ipBlock)) {
              set(ipBlock, 'isUniq', true);
            } else {
              set(ipBlock, 'collapsed', true);
            }
          });
        }
        return data.data;
      })
      .catch((http) => {
        if (http.status !== 0) {
          // Killed
          return this.$q.reject(http.data);
        }

        return null;
      });
  }

  killAllGetIpsListForService() {
    angular.forEach(this.ipsListDeferredObjs, (promise) => {
      promise.resolve();
    });

    this.ipsListDeferredObjs = [];
  }

  /* ==================================
     =            DESCRIPTION         =
     ================================== */
  editIpDescription(block, description) {
    return this.OvhHttp.put('/ip/{block}', {
      rootPath: 'apiv6',
      urlParams: {
        block,
      },
      data: {
        description,
      },
    });
  }

  /* ===============================
     =            IP DEL           =
     =============================== */
  deleteIpBlock(ipBlock) {
    return this.OvhHttp.post('/ip/{block}/terminate', {
      rootPath: 'apiv6',
      urlParams: {
        block: ipBlock,
      },
    });
  }

  /* ===============================
     =            IP MOVE          =
     =============================== */
  getDedicatedServicesList() {
    return this.$http
      .get([this.swsProxypassPath, 'dedicated/server'].join('/'))
      .then((data) => data.data.sort())
      .catch((http) => this.$q.reject(http.data));
  }

  checkIfIpCanBeMovedTo(serviceName, ip) {
    return this.$http
      .get(
        `${
          this.swsProxypassPath
        }/dedicated/server/${serviceName}/ipCanBeMovedTo?ip=${window.encodeURIComponent(
          ip,
        )}`,
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  moveIpBlock(serviceName, block, nexthop) {
    return this.$http
      .post(
        `${this.swsProxypassPath}/ip/${window.encodeURIComponent(block)}/move`,
        {
          to: serviceName,
          nexthop,
        },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  moveIpBlockToPark(block) {
    return this.$http
      .post(
        `${this.swsProxypassPath}/ip/${window.encodeURIComponent(block)}/park`,
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  getIpMove(block) {
    return this.$http
      .get(
        `${this.swsProxypassPath}/ip/${window.encodeURIComponent(block)}/move`,
      )
      .then((data) => {
        const destinationIps = reduce(
          data.data,
          (concatList, destination, serviceType) => {
            const obj = destination.map((infos) => ({
              service: infos.service,
              nexthop: infos.nexthop,
              serviceType,
            }));
            return [...concatList, ...obj];
          },
          [],
        );

        return destinationIps;
      })
      .catch((http) => this.$q.reject(http.data));
  }
}
