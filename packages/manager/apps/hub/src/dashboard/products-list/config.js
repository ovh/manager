import { find, get, head, isEmpty, map, startCase } from 'lodash-es';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { DEFAULT_NUMBER_OF_COLUMNS } from './constants';

const matchingTypes = {
  boolean: 'boolean',
  enum: 'string',
  long: 'number',
  string: 'string',
};

const getSorting = ({ sort, sortOrder }, property) =>
  sort === property ? sortOrder.toLowerCase() : true;

const mapApiProperties = (properties, sorting) =>
  map(properties, (value, name) => ({
    title: name,
    property: name,
    type: /Enum/.test(value.type)
      ? matchingTypes.enum
      : matchingTypes[value.type],
    searchable: true,
    filterable: true,
    sortable: getSorting(sorting, name),
  }));

const getFirstColumnTemplate = (propertyId, sorting) => ({
  title: propertyId,
  property: propertyId,
  template: `
      <a
        data-ng-href="{{ $row.managerLink }}"
        data-ng-bind="$row.${propertyId}"
        data-track-on="click"
        data-track-name="hub::product-listing::go-to-service"></a>
    `,
  searchable: true,
  filterable: true,
  sortable: getSorting(sorting, propertyId),
});

export const urlQueryParams = `columns&${ListLayoutHelper.urlQueryParams}`;

export const params = {
  columns: {
    squash: true,
    value: '[]',
    dynamic: true,
  },
  ...ListLayoutHelper.stateParams,
};

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
  displayedColumns: /* @ngInject */ ($transition$) =>
    JSON.parse($transition$.params().columns),
  loadRow: /* @ngInject */ (products, propertyId) => (service) => ({
    ...service,
    managerLink: get(
      products.find(({ resource }) => resource.name === service[propertyId]),
      'url',
    ),
  }),
  columns: /* @ngInject */ (
    dataModel,
    displayedColumns,
    propertyId,
    sort,
    sortOrder,
  ) => {
    const columns = mapApiProperties(dataModel.properties, {
      sort,
      sortOrder,
    }).filter(({ title, type }) => type && title !== propertyId);
    columns.unshift(getFirstColumnTemplate(propertyId, { sort, sortOrder }));
    return columns.map((column, index) => ({
      ...column,
      title: startCase(column.title),
      hidden: isEmpty(displayedColumns)
        ? index > DEFAULT_NUMBER_OF_COLUMNS
        : !displayedColumns.includes(column.title),
    }));
  },
  hideBreadcrumb: () => false,
  breadcrumb: /* @ngInject */ ($translate, productType) =>
    $translate.instant(`manager_hub_products_${productType}`),
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
};

export default {
  urlQueryParams,
  params,
  component,
  resolves,
};
