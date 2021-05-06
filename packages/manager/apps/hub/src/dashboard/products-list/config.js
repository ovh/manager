import { find, get, head } from 'lodash-es';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export const component = 'managerListLayout';

export const resolves = {
  ...ListLayoutHelper.stateResolves,

  products: /* @ngInject */ (productType, services) =>
    get(services, `data.data.${productType}.data`),
  id: /* @ngInject */ (productType) => productType,

  resourcePath: /* @ngInject */ (products) => get(head(products), 'route.path'),
  propertyId: /* @ngInject */ (products) => get(head(products), 'propertyId'),
  dataModel: /* @ngInject */ (resourcePath, schema) => {
    const model = get(
      find(get(find(schema.apis, { path: resourcePath }), 'operations'), {
        httpMethod: 'GET',
      }),
      'responseType',
    );
    return model;
  },
  serviceNameTracker: () => 'hub::product-listing::go-to-service',
  displayedColumns: /* @ngInject */ ($transition$) =>
    JSON.parse($transition$.params().columns),
  getServiceNameLink: /* @ngInject */ (products, propertyId) => (service) =>
    get(
      products.find(({ resource }) => resource.name === service[propertyId]),
      'url',
    ),
  hideBreadcrumb: () => false,
  breadcrumb: /* @ngInject */ ($translate, productType) =>
    $translate.instant(`manager_hub_products_${productType}`),
  defaultFilterColumn: /* @ngInject */ (propertyId) => propertyId,
  header: /* @ngInject */ ($translate, productType) =>
    $translate.instant(`manager_hub_products_${productType}`),

  description: /* @ngInject */ (productType) => {
    return `<ovh-manager-hub-carousel
        class="w-100"
        data-product-type="${productType}"
    ></ovh-manager-hub-carousel>`;
  },
  customizableColumns: () => true,
};

export default {
  component,
  resolves,
};
