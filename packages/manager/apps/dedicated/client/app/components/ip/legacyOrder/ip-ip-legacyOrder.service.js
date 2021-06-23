import filter from 'lodash/filter';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';

export default class DedicatedIPOrder {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  static getRouteFragmentForService(serviceType) {
    switch (serviceType) {
      case 'DEDICATED':
        return 'dedicated/server';
      case 'PCC':
        return 'dedicatedCloud';
      case 'VPS':
        return 'vps';
      default:
        return serviceType;
    }
  }

  getServicesByType(type) {
    const queue = [];
    let services = [];

    if (!type || type === 'DEDICATED') {
      queue.push(
        this.$http
          .get('apiv6/order/dedicated/server')
          .then(({ data }) => {
            const items = data.map((svc) => ({
              serviceType: 'DEDICATED',
              serviceName: svc,
            }));
            services = services.concat(sortBy(items, 'serviceName'));
          })
          .catch(({ data }) => this.$q.reject(data)),
      );
    }

    if (!type || type === 'PCC') {
      queue.push(
        this.$http
          .get('apiv6/order/dedicatedCloud')
          .then(({ data }) => {
            const items = data.map((svc) => ({
              serviceType: 'PCC',
              serviceName: svc,
            }));
            services = services.concat(sortBy(items, 'serviceName'));
          })
          .catch(({ data }) => this.$q.reject(data)),
      );
    }

    if (!type || type === 'VPS') {
      queue.push(
        this.$http
          .get('apiv6/order/vps')
          .then(({ data }) => {
            const items = data.map((svc) => ({
              serviceType: 'VPS',
              serviceName: svc,
            }));
            services = services.concat(sortBy(items, 'serviceName'));
          })
          .catch(({ data }) => this.$q.reject(data)),
      );
    }

    return this.$q
      .all(queue)
      .then(() => services)
      .catch(({ data }) => this.$q.reject(data));
  }

  checkIfAllowed(service, orderEnum) {
    return this.$http
      .get(
        `apiv6/order/${DedicatedIPOrder.getRouteFragmentForService(
          service.serviceType,
        )}/${service.serviceName}`,
      )
      .then(
        ({ data }) =>
          isArray(data) && !isEmpty(data) && data.includes(orderEnum),
      )
      .catch(({ data }) => this.$q.reject(data));
  }

  getServiceOrderableIp(service) {
    switch (service.serviceType) {
      case 'DEDICATED':
        return this.$http
          .get(`apiv6/dedicated/server/${service.serviceName}/orderable/ip`)
          .then((response) => {
            const { data } = response;
            data.ipv4 = filter(data.ipv4, { type: 'failover' });
            if (!data.ipv4 || !data.ipv4.length) {
              return false;
            }

            ['ipv4', 'ipv6'].forEach((ipType) => {
              data[ipType] = filter(
                data[ipType],
                (ipBlock) => ipBlock.ipNumber > 0,
              );
            });

            data.ipv4BlockSizesAll = data.ipv4.reduce(
              (globalArray, val) => [...val.blockSizes, ...globalArray],
              [],
            );
            data.ipv4BlockSizesAll = uniq(data.ipv4BlockSizesAll);
            data.ipv4BlockSizesAll.sort((a, b) => a - b);

            return data;
          });
      case 'PCC':
        return this.$q.when({});
      case 'VPS':
        return this.$http
          .get(`apiv6/vps/${service.serviceName}`)
          .then((data) => {
            if (data.data && data.data.model) {
              return this.$http
                .get(`apiv6/vps/${service.serviceName}/ips`)
                .then((dataIps) => {
                  let selfAdditionalIp = 0;
                  const queue = [];

                  angular.forEach(dataIps.data, (ip) => {
                    if (~ip.indexOf('.')) {
                      // only v4
                      queue.push(
                        this.$http
                          .get(`apiv6/vps/${service.serviceName}/ips/${ip}`)
                          .then((dataIp) => {
                            if (
                              dataIp.data &&
                              dataIp.data.type === 'additional'
                            ) {
                              selfAdditionalIp += 1;
                            }
                          }),
                      );
                    }
                  });

                  return this.$q
                    .all(queue)
                    .then(() => ({
                      maximumAdditionnalIp:
                        data.data.model.maximumAdditionnalIp - selfAdditionalIp,
                      ipRange: range(
                        1,
                        data.data.model.maximumAdditionnalIp -
                          selfAdditionalIp +
                          1,
                      ),
                      vpsInfos: data.data,
                    }))
                    .catch((http) => this.$q.reject(http));
                })
                .catch((http) => this.$q.reject(http));
            }
            return false;
          })
          .catch((http) => this.$q.reject(http));
      default:
        return null;
    }
  }

  getAvailableCountries(service) {
    switch (service.serviceType) {
      case 'DEDICATED':
        return this.$http
          .get(
            `apiv6/dedicated/server/${service.serviceName}/ipCountryAvailable`,
          )
          .then((data) => (data.data || []).sort())
          .catch((http) => this.$q.reject(http.data));
      case 'PCC':
        return this.$http
          .get(
            `apiv6/dedicatedCloud/${service.serviceName}/orderableIpCountries`,
          )
          .then((data) => (data.data || []).sort())
          .catch((http) => this.$q.reject(http.data));
      case 'VPS':
        return this.$http
          .get(`apiv6/vps/${service.serviceName}/ipCountryAvailable`)
          .then((data) => (data.data || []).sort())
          .catch((http) => this.$q.reject(http.data));
      default:
        return null;
    }
  }

  getProfessionalUsePrice(serviceName) {
    return this.$http
      .get(`apiv6/dedicated/server/${serviceName}`)
      .then((data) => {
        if (data.data.professionalUse === false) {
          return this.$http
            .get(
              `apiv6/price/dedicated/server/professionalUse/${data.data.commercialRange}`,
            )
            .then((data2) => data2.data.text)
            .catch((http) => this.$q.reject(http.data));
        }
        return null;
      })
      .catch((http) => this.$q.reject(http.data));
  }

  checkIfCanadianServer(serviceName) {
    return this.$http
      .get(`apiv6/dedicated/server/${serviceName}`)
      .then((data) => {
        if (
          data.data &&
          data.data.datacenter &&
          (/^bhs/i.test(data.data.datacenter) ||
            /^sgp/i.test(data.data.datacenter) ||
            /^syd/i.test(data.data.datacenter))
        ) {
          return true;
        }
        return false;
      })
      .catch((http) => this.$q.reject(http.data));
  }

  getOrder(service, params) {
    return this.$http
      .get(
        `apiv6/order/${DedicatedIPOrder.getRouteFragmentForService(
          service.serviceType,
        )}/${service.serviceName}/ip`,
        { params },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  getOrderForDuration(service, params, duration) {
    return this.$http
      .get(
        `apiv6/order/${DedicatedIPOrder.getRouteFragmentForService(
          service.serviceType,
        )}/${service.serviceName}/ip/${duration}`,
        { params },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  postOrder(service, params, duration) {
    return this.$http
      .post(
        `apiv6/order/${DedicatedIPOrder.getRouteFragmentForService(
          service.serviceType,
        )}/${service.serviceName}/ip/${duration}`,
        params,
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  /*= ================================
    =            MIGRATION            =
    ================================= */

  getServiceMigrateableIp(params) {
    return this.$http
      .get(
        `apiv6/order/dedicated/server/${params.service.serviceName}/ipMigration`,
        {
          params: {
            ip: params.ip,
            token: params.token,
          },
        },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http));
  }

  getMigrateIpOrder(params, duration) {
    return this.$http
      .get(
        `apiv6/order/dedicated/server/${params.service.serviceName}/ipMigration/${duration}`,
        {
          params: {
            ip: params.ip,
            token: params.token,
          },
        },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  postMigrateIpOrder(params) {
    return this.$http
      .post(
        `apiv6/order/dedicated/server/${params.service.serviceName}/ipMigration/${params.duration}`,
        {
          ip: params.ip,
          token: params.token,
        },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }
}
