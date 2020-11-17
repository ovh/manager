import compact from 'lodash/compact';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import head from 'lodash/head';
import remove from 'lodash/remove';
import snakeCase from 'lodash/snakeCase';
import uniq from 'lodash/uniq';

import { SUB_SERVICE_TYPES } from './issues-form.constants';

function getServiceTypeName(serviceType) {
  const route = get(serviceType, 'route.path', '')
    .replace(/\/\{[^}]+\}/g, '') // remove dynamic parts {serviceName} etc
    .replace(/^\//, '') // remove first slash
    .replace(/\//g, '_'); // replace remaining slashes with underscore
  return snakeCase(route); // fooBar => foo_bar
}

export default class {
  /* @ngInject */
  constructor($http, $translate, OvhApiService, OvhApiSupport) {
    this.$http = $http;
    this.$translate = $translate;
    this.OvhApiService = OvhApiService;
    this.OvhApiSupport = OvhApiSupport;
  }

  static addSubTypes(serviceTypes) {
    forEach(SUB_SERVICE_TYPES, (subTypes, serviceName) => {
      const service = head(
        remove(serviceTypes, (serviceType) => serviceType.name === serviceName),
      );
      if (service) {
        forEach(subTypes, (subType) => {
          serviceTypes.push({
            ...service,
            ...subType,
          });
        });
      }
    });
    return serviceTypes;
  }

  getServices(route, subType) {
    return this.OvhApiService.Aapi().query({
      type: route,
      external: false,
      subType,
    }).$promise;
  }

  getServiceTypesRaw() {
    return this.OvhApiSupport.v6().getServiceTypes().$promise;
  }

  getServiceTypes() {
    return this.getServiceTypesRaw()
      .then((serviceTypes) => this.constructor.addSubTypes(serviceTypes))
      .then((serviceTypes) =>
        serviceTypes
          .map((serviceType) => ({
            ...serviceType,
            label: this.$translate.instant(
              `ovhManagerSupport_new_serviceType_${serviceType.label ||
                serviceType.name}`,
            ),
          }))
          .sort((a, b) =>
            a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }),
          ),
      );
  }

  filterOwnServiceTypes(serviceTypes) {
    return this.$http
      .get('/services', {
        serviceType: 'apiv6',
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': 5000,
        },
      })
      .then(({ data }) => data)
      .then((items) =>
        compact(uniq(items.map((item) => getServiceTypeName(item)))),
      )
      .then((ownServiceTypes) =>
        serviceTypes.filter((serviceType) => {
          if (/\{|\*/.test(serviceType.route)) {
            // L2 service
            switch (serviceType.route) {
              case '/telephony/*/line':
                return ownServiceTypes.includes('telephony_lines');
              case '/telephony/*/number':
                return ownServiceTypes.includes('telephony_aliases');
              case '/telephony/*/carrierSip':
                return ownServiceTypes.includes('telephony_lines');
              default: {
                const parentServiceType = snakeCase(
                  get(serviceType.route.match(/([^*{]+)\//), '1', ''),
                );
                return ownServiceTypes.includes(parentServiceType);
              }
            }
          }
          // L1 service
          return ownServiceTypes.includes(serviceType.name);
        }),
      );
  }
}
