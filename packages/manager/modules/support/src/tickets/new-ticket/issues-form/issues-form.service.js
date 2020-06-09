import compact from 'lodash/compact';
import get from 'lodash/get';
import snakeCase from 'lodash/snakeCase';
import uniq from 'lodash/uniq';

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

  getServices(route) {
    return this.OvhApiService.Aapi().query({
      type: route,
      external: false,
    }).$promise;
  }

  getServiceTypesRaw() {
    return this.OvhApiSupport.v6().getServiceTypes().$promise;
  }

  getServiceTypes() {
    return this.getServiceTypesRaw().then((serviceTypes) =>
      [...serviceTypes]
        .map((serviceType) => ({
          ...serviceType,
          label: this.$translate.instant(
            `ovhManagerSupport_new_serviceType_${serviceType.name}`,
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
