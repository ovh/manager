import { camelCase, find, get, head } from 'lodash-es';
import columnsConfiguration from '@ovh-ux/manager-product-listing-configuration';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export const component = 'managerListLayout';

export const resolves = {
  products: /* @ngInject */ (productType, services) =>
    get(services, `data.data.${productType}.data`),
  resourcePath: /* @ngInject */ (products) => get(head(products), 'route.path'),
  propertyId: /* @ngInject */ (products) => get(head(products), 'propertyId'),

  dataModel: /* @ngInject */ (resourcePath, schema) => {
    const model = get(
      find(get(find(schema.apis, { path: resourcePath }), 'operations'), {
        httpMethod: 'GET',
      }),
      'responseType',
    );
    return schema.models[model];
  },

  serviceNameTracker: () => 'hub::product-listing::go-to-service',

  columnConfig: /* @ngInject */ (
    $q,
    dataModel,
    defaultFilterColumn,
    displayedColumns,
    productType,
  ) =>
    columnsConfiguration[camelCase(productType)]
      ? columnsConfiguration[camelCase(productType)].getConfig()
      : $q.resolve(
          ListLayoutHelper.getDefaultConfiguration(
            dataModel,
            defaultFilterColumn,
            displayedColumns,
          ),
        ),

  getServiceNameLink: /* @ngInject */ (products, propertyId) => (service) =>
    get(
      products.find(({ resource }) => resource.name === service[propertyId]),
      'url',
    ),

  id: /* @ngInject */ (productType) => productType,
  defaultFilterColumn: /* @ngInject */ (propertyId) => propertyId,
  header: /* @ngInject */ ($translate, productType) =>
    $translate.instant(`manager_hub_products_${productType}`),

  description: /* @ngInject */ (notifications, productType) => {
    const filteredNotifications = notifications.filter(
      ({ type }) => type === productType,
    );
    return `<ovh-manager-hub-carousel
        class="w-100"
        data-ng-if="${filteredNotifications.length}"
        data-items="${filteredNotifications}"
    ></ovh-manager-hub-carousel>`;
  },
  customizableColumns: () => true,

  hideBreadcrumb: () => false,
  breadcrumb: /* @ngInject */ ($translate, productType) =>
    $translate.instant(`manager_hub_products_${productType}`),
};

export default {
  component,
  resolves,
};
