import find from 'lodash/find';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import union from 'lodash/union';

import { IP_TYPE, SERVICE_URL_DATA } from './ip-ip.constant';

export default /* @ngInject */ function Ip(
  $http,
  $q,
  IpRange,
  $location,
  OvhHttp,
  coreURLBuilder,
) {
  const self = this;
  const aapiIpPath = '/sws/module/ip';
  const swsProxypassPath = 'apiv6';

  this.getIpDetails = (block) =>
    $http
      .get(
        [swsProxypassPath, 'ip', window.encodeURIComponent(block)].join('/'),
        { cache: true },
      )
      .then(
        (response) => response.data,
        (http) => $q.reject(http.data),
      );

  this.checkTaskUnique = (ipBlock, fct) => {
    const queue = [];
    let tasks = [];

    angular.forEach(['init', 'doing', 'todo'], (status) => {
      queue.push(
        $http
          .get(
            `${swsProxypassPath}/ip/${window.encodeURIComponent(ipBlock)}/task`,
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

    return $q.all(queue).then(() => tasks);
  };

  this.getServerModels = () =>
    $http
      .get(`${swsProxypassPath}/dedicated/server.json`, { cache: true })
      .then((response) => {
        if (response && response.data && response.data.models) {
          return response.data.models;
        }
        return {};
      });
  this.getIpModels = () =>
    $http
      .get(`${swsProxypassPath}/ip.json`, { cache: true })
      .then((response) => {
        if (response && response.data && response.data.models) {
          return response.data.models;
        }
        return {};
      });
  this.getOrderModels = () =>
    $http
      .get(`${swsProxypassPath}/order.json`, { cache: true })
      .then((response) => {
        if (response && response.data && response.data.models) {
          return response.data.models;
        }
        return {};
      });
  this.getMeModels = () =>
    $http
      .get(`${swsProxypassPath}/me.json`, { cache: true })
      .then((response) => {
        if (response && response.data && response.data.models) {
          return response.data.models;
        }
        return {};
      });

  this.cancelActionParam = (actionName) => {
    if ($location.search().action === actionName && $location.search().ip) {
      $location.search('action', null);
      $location.search('ip', null);
      $location.search('ipBlock', null);
    }
  };

  this.getNichandleCountryEnum = () =>
    self.getMeModels().then((models) => models['nichandle.CountryEnum'].enum);

  this.getNichandleIpRegistryEnum = () =>
    self
      .getMeModels()
      .then((models) => models['nichandle.IpRegistryEnum'].enum);

  this.getPriceForParking = () =>
    $http
      .get([swsProxypassPath, 'price/dedicated/server/ip/parking'].join('/'), {
        cache: true,
      })
      .then((response) => response.data.text);

  /**
   * Cloud Failover IPs have a subtype: either "cloud" or "ovh".
   *   - subtype "cloud" are IPFOs bought from Cloud manager in a Cloud project
   *   - subtype "ovh" are IPFOs imported into a Cloud project
   */
  this.getCloudIpSubType = (serviceName, ip) => {
    const basePath = `${swsProxypassPath}/cloud/project/${serviceName}/ip`;
    return $http
      .get(basePath, {
        cache: true,
      })
      .then((resp) => {
        const cloudIp = find(resp.data, { ip });
        if (cloudIp && cloudIp.id) {
          return $http
            .get(`${basePath}/failover/${cloudIp.id}`, {
              cache: true,
            })
            .then((res) => res.data.subType);
        }
        return null;
      });
  };

  /*= =========================================
        =            DASHBOARD AND SUBS            =
        ========================================== */

  function getIpsSanitized(ipBlock, _ips = []) {
    let ips = _ips;

    // If IPV4, generate full list of ips with infos
    if (~ipBlock.indexOf('.')) {
      let ipFromApi;
      const fullIpsList = [];
      const ipv4List = IpRange.getRangeForIpv4Block(ipBlock);

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

  this.getServicesList = () =>
    OvhHttp.get('/sws/products/services', {
      rootPath: '2api',
    });

  this.getIpsForIpBlock = (ipBlock, serviceName, serviceType) =>
    $http
      .get(`${aapiIpPath}/${window.encodeURIComponent(ipBlock)}`, {
        serviceType: 'aapi',
        params: {
          serviceName: serviceName || undefined,
          serviceType: serviceType || undefined,
        },
      })
      .then((response) => getIpsSanitized(ipBlock, response.data))
      .then((ips) =>
        map(ips, (ip) => {
          if (ipBlock !== `${ip.ip}/32`) {
            set(ip, 'block', ipBlock);
          }
          return ip;
        }),
      );

  this.getIpsForIpV6 = (ipBlock, serviceName) =>
    $q
      .all({
        ips: $http
          .get(`${aapiIpPath}/${window.encodeURIComponent(ipBlock)}`, {
            serviceType: 'aapi',
            params: {
              serviceName,
              serviceType: 'vrack',
            },
          })
          .then(({ data }) => getIpsSanitized(ipBlock, data)),
        bridgedSubrange: $http
          .get(
            `/vrack/${window.encodeURIComponent(
              serviceName,
            )}/ipv6/${window.encodeURIComponent(ipBlock)}/bridgedSubrange`,
          )
          .then(({ data }) => data),
        routedSubrange: $http
          .get(
            `/vrack/${window.encodeURIComponent(
              serviceName,
            )}/ipv6/${window.encodeURIComponent(ipBlock)}/routedSubrange`,
          )
          .then(({ data }) => data),
      })
      .then(({ ips, bridgedSubrange, routedSubrange }) => {
        const subRanges = [...bridgedSubrange, ...routedSubrange];
        return [
          ...ips.map((ip) => {
            set(ip, 'block', ipBlock);
            return ip;
          }),
          ...subRanges.map((ip) => {
            return {
              ip,
              version: IP_TYPE.V6,
              type: 'SUBRANGE',
              isUniq: true,
            };
          }),
        ];
      });

  let ipsListDeferredObjs = [];

  this.getIpsListForService = (serviceName) => {
    const deferredObj = $q.defer();
    ipsListDeferredObjs.push(deferredObj);

    return $http
      .get(aapiIpPath, {
        serviceType: 'aapi',
        params: {
          serviceName,
        },
        timeout: deferredObj.promise,
      })
      .then(
        (data) => {
          if (data.data && data.data.length) {
            angular.forEach(data.data, (ipBlock) => {
              // Just to be sure
              if (!ipBlock.alerts) {
                set(ipBlock, 'alerts', {});
              }
              if (!ipBlock.ips) {
                set(ipBlock, 'ips', []);
              }

              if (ipBlock.version === IP_TYPE.V4) {
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
        },
        (http) => {
          if (http.status !== 0) {
            // Killed
            return $q.reject(http.data);
          }
          return null;
        },
      );
  };

  this.killAllGetIpsListForService = () => {
    angular.forEach(ipsListDeferredObjs, (promise) => {
      promise.resolve();
    });
    ipsListDeferredObjs = [];
  };

  // this.getServiceInfos = function getServiceInfos(serviceType, serviceName) {
  //   return $http
  //   .get([swsIpPath, serviceType, serviceName].join("/"))
  //   .then(function (response) {
  //     return response.data;
  //   });
  // };

  // this.getServiceDescription = function getServiceDescription(serviceType, serviceName) {
  //   switch(serviceType) {
  //     case "DEDICATED":
  //       return $http
  //         .get([swsProxypassPath, "dedicated/server", serviceName].join("/"))
  //         .then(function(response) {
  //           if (response && response.data && response.data.reverse) {
  //             if (response.data.reverse.replace(/\.$/, "") === response.data.name) {
  //               return null;
  //             } else {
  //               return response.data.reverse;
  //             }
  //           } else {
  //             return null;
  //           }
  //         });
  //     case "PCC":
  //       return $http
  //         .get([swsProxypassPath, "dedicatedCloud", serviceName].join("/"))
  //         .then(function(response) {
  //           if (response && response.data && response.data.description) {
  //             return response.data.description;
  //           } else {
  //             return null;
  //           }
  //         });
  //     case "VRACK":
  //       return $http
  //         .get([swsProxypassPath, "vrack", serviceName].join("/"))
  //         .then(function(response) {
  //           if (response && response.data && response.data.name) {
  //             return response.data.name;
  //           } else {
  //             return null;
  //           }
  //         });
  //     default:
  //       return $q.reject("Not yet implemented");
  //   }
  // };

  /*= ==================================
        =            DESCRIPTION            =
        =================================== */
  this.editIpDescription = (block, description) =>
    OvhHttp.put('/ip/{block}', {
      rootPath: 'apiv6',
      urlParams: {
        block,
      },
      data: {
        description,
      },
    });

  /*= ==========================================
      =            IP ServiceInfos            =
      ========================================== */
  this.getIpServiceInfos = (ipBlock) => {
    const [ip, block] = ipBlock.split('/');
    const serviceName = `ip-${block === '32' ? ip : ipBlock}`;
    return OvhHttp.get('/ip/service/{serviceName}/serviceInfos', {
      rootPath: 'apiv6',
      urlParams: { serviceName },
    }).then((data) => ({
      serviceName,
      ...data,
    }));
  };

  /*= ==============================
        =            IP MOVE            =
        =============================== */

  this.getDedicatedServicesList = function getDedicatedServicesList() {
    return $http.get([swsProxypassPath, 'dedicated/server'].join('/')).then(
      (data) => data.data.sort(),
      (http) => $q.reject(http.data),
    );
  };

  this.checkIfIpCanBeMovedTo = function checkIfIpCanBeMovedTo(serviceName, ip) {
    return $http
      .get(
        `${swsProxypassPath}/dedicated/server/${serviceName}/ipCanBeMovedTo?ip=${window.encodeURIComponent(
          ip,
        )}`,
      )
      .then(
        (data) => data.data,
        (http) => $q.reject(http.data),
      );
  };

  this.moveIpBlock = function moveIpBlock(serviceName, block, nexthop) {
    return $http
      .post(`${swsProxypassPath}/ip/${window.encodeURIComponent(block)}/move`, {
        to: serviceName,
        nexthop,
      })
      .then(
        (data) => data.data,
        (http) => $q.reject(http.data),
      );
  };

  this.moveIpBlockToPark = (block) =>
    $http
      .post(`${swsProxypassPath}/ip/${window.encodeURIComponent(block)}/park`)
      .then(
        (data) => data.data,
        (http) => $q.reject(http.data),
      );

  this.getIpMove = (block) =>
    $http
      .get(`${swsProxypassPath}/ip/${window.encodeURIComponent(block)}/move`)
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
      });

  this.fetchAlerts = ({ serviceType }) => {
    const alerts = {
      antihack: [],
      mitigation: [],
      spam: [],
    };
    const { cancel, request } = this.fetchIps({
      serviceType,
      pageSize: 5000,
    });
    return {
      cancel,
      request: request.then(({ ips }) => {
        ips.forEach((ip) => {
          Object.keys(alerts).forEach((key) => {
            if (ip.alerts[key]) {
              ip.alerts[key].forEach((alert) =>
                alerts[key].push({ ip, alert }),
              );
            }
          });
        });
        return alerts;
      }),
    };
  };

  this.fetchIps = ({
    serviceType,
    otherParams,
    pageNumber = 1,
    pageSize = 10,
    extras = true,
    version,
    isAdditionalIp,
    simpleMode,
  }) => {
    const params = {
      ...otherParams,
      ...(serviceType && { type: serviceType }),
      extras,
      pageNumber,
      pageSize,
      version,
      isAdditionalIp,
      simpleMode,
    };
    const canceller = $q.defer();
    const cancel = () => {
      canceller.resolve();
    };
    const request = $q
      .all({
        services: this.getServicesList(),
        ips: $http
          .get('/ips', {
            params,
            serviceType: 'aapi',
            timeout: canceller.promise,
          })
          .then(({ data }) => data),
      })
      .then(({ services, ips: { count, data: ips } }) => {
        const serviceMap = {};
        services.forEach(({ category, serviceName }) => {
          serviceMap[serviceName] = category;
        });
        ips.forEach((ip) => {
          const serviceName = ip.routedTo?.serviceName;
          let category;

          if (!serviceName) {
            Object.assign(ip, { service: null });
            return;
          }

          if (serviceMap[serviceName]) {
            category = serviceMap[serviceName];
          } else {
            category = Object.keys(SERVICE_URL_DATA).find((key) =>
              SERVICE_URL_DATA[key].regEx?.test(serviceName),
            );
          }

          if (!category) {
            category = 'HOUSING';
          }

          const { universe, path } = SERVICE_URL_DATA[category];
          Object.assign(ip, {
            service: {
              category,
              serviceName,
              url: coreURLBuilder.buildURL(universe, path, { serviceName }),
            },
          });
        });
        return { count, ips };
      });

    return {
      request,
      cancel,
    };
  };
}
