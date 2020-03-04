import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import startCase from 'lodash/startCase';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { DEFAULT_NUMBER_OF_COLUMNS } from './constants';

const matchingTypes = {
  boolean: 'boolean',
  enum: 'string',
  long: 'number',
  string: 'string',
};

const mapApiProperties = (properties) =>
  map(properties, (value, name) => ({
    title: name,
    property: name,
    type: /Enum/.test(value.type)
      ? matchingTypes.enum
      : matchingTypes[value.type],
    searchable: true,
    filterable: true,
    sortable: true,
  }));

const getFirstColumnTemplate = (propertyId) => ({
  title: propertyId,
  property: propertyId,
  template: `
    <a data-ng-href="{{ $row.url }}" data-ng-bind="$row.${propertyId}"></a>
  `,
  searchable: true,
  filterable: true,
  sortable: 'asc',
});

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.products', {
    url: `:product?columns${ListLayoutHelper.urlQueryParams}`,
    params: {
      columns: {
        squash: true,
        value: '[]',
      },
      ...ListLayoutHelper.stateParams,
    },
    component: 'hubProductListing',
    resolve: {
      ...ListLayoutHelper.stateResolves,
      productType: /* @ngInject */ ($transition$) =>
        $transition$.params().product.toUpperCase(),
      products: /* @ngInject */ (productType, services) =>
        services[productType].data,
      resourcePath: /* @ngInject */ (products) =>
        get(head(products), 'route.path'),
      propertyId: /* @ngInject */ (products) =>
        get(head(products), 'propertyId'),
      apiPath: /* @ngInject */ (resourcePath) =>
        resourcePath.replace(/\/\{[a-zA-Z]+\}/g, ''),
      schema: /* @ngInject */ ($http, resourcePath) =>
        $http
          .get('/')
          .then(({ data: schema }) =>
            find(schema.apis, ({ path }) =>
              new RegExp(`^${path}`).test(resourcePath),
            ),
          )
          .then(({ path }) => $http.get(`${path}.json`))
          .then(({ data }) => data),
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
      onColumnChange: /* @ngInject */ ($state, $transition$) => (id, columns) =>
        $state.go('.', {
          ...$transition$.params(),
          columns: JSON.stringify(
            map(
              columns.filter(({ hidden }) => !hidden),
              'name',
            ),
          ),
        }),
      columns: /* @ngInject */ (dataModel, displayedColumns, propertyId) => {
        const columns = mapApiProperties(dataModel.properties).filter(
          ({ title, type }) => type && title !== propertyId,
        );
        columns.unshift(getFirstColumnTemplate(propertyId));
        return columns.map((column, index) => ({
          ...column,
          name: startCase(column.name),
          hidden: isEmpty(displayedColumns)
            ? index > DEFAULT_NUMBER_OF_COLUMNS
            : !displayedColumns.includes(column.title),
        }));
      },
    },
  });
};
