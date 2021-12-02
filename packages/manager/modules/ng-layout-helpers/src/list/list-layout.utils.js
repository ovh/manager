import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import startCase from 'lodash/startCase';

import { DEFAULT_NUMBER_OF_COLUMNS, STRING_COLUMN_OPTIONS } from './constants';

export const FILTER_OPERATORS = {
  contains: 'like',
  is: 'eq',
  isAfter: 'gt',
  isBefore: 'lt',
  isNot: 'ne',
  smaller: 'lt',
  bigger: 'gt',
  startsWith: 'like',
  endsWith: 'like',
};

export const mapFilterForIceberg = (comparator, reference) =>
  reference.map((val) => {
    switch (comparator.toUpperCase()) {
      case 'CONTAINS':
        return `%${val}%`;
      case 'STARTSWITH':
        return `${val}%`;
      case 'ENDSWITH':
        return `%${val}`;
      default:
        return val;
    }
  });

export const getLink = (column, tracker) => `
  <a
    data-ng-href="{{ $ctrl.getServiceNameLink($row) }}"
    data-ng-bind="$row.${column.property}"
    ${tracker ? `data-track-on="click" data-track-name="${tracker}"` : ''}
  ></a>
`;

const generateTemplate = (column) => `
 <span
 ${
   column.map
     ? `class="oui-badge oui-badge_{{ $ctrl.mappings['${column.property}']($row)}}"`
     : ''
 }
 data-ng-bind="$ctrl.formatters['${column.property}']($row)"></span>
`;

export const matchingTypes = {
  boolean: 'boolean',
  enum: 'options',
  long: 'number',
  string: 'string',
};

const getMatchingType = (type) =>
  /Enum/.test(type) ? matchingTypes.enum : matchingTypes[type];

const getTypeOptions = (schema, type, column, columnType) => {
  if (columnType === 'options') {
    return {
      hideOperators: true,
      values: schema.models[type].enum.reduce(
        (values, value) => ({
          ...values,
          [value]: column.format ? column.format(value) : value,
        }),
        {},
      ),
    };
  }

  if (columnType === 'string') {
    return {
      operators: STRING_COLUMN_OPTIONS,
    };
  }

  return {};
};

export const getSorting = ({ sort, sortOrder }, property) =>
  sort === property ? sortOrder.toLowerCase() : true;

export const parseConfig = (columns, model, schema, sorting, tracking) =>
  map(columns, (column) => {
    const propertyType = get(model.properties[column.property], 'type');
    const type = getMatchingType(propertyType);
    return {
      title: column.label,
      property: column.property,
      ...(column.serviceLink ? { template: getLink(column, tracking) } : {}),
      ...(column.format ? { template: generateTemplate(column) } : {}),
      type,
      typeOptions: getTypeOptions(schema, propertyType, column, type),
      searchable: true,
      filterable: true,
      sortable: getSorting(sorting, column.property),
      hidden: !type,
      ...column,
    };
  });

const mapApiProperties = (properties) => {
  const displayedProperties = pickBy(
    properties,
    (property) => !!getMatchingType(property.type),
  );
  return map(displayedProperties, (value, name) => ({
    label: name,
    property: name,
  }));
};

export const getDefaultConfiguration = (
  dataModel,
  defaultFilterColumn,
  displayedColumns,
) => {
  const columns = mapApiProperties(dataModel.properties).filter(
    ({ label }) => label !== defaultFilterColumn,
  );
  columns.unshift({
    label: defaultFilterColumn,
    property: defaultFilterColumn,
    serviceLink: true,
  });
  return {
    data: columns.map((column, index) => ({
      ...column,
      label: startCase(column.label),
      hidden: isEmpty(displayedColumns)
        ? index > DEFAULT_NUMBER_OF_COLUMNS
        : !displayedColumns.includes(column.label),
    })),
  };
};

/**
 * Contains resolve object that allows to handle a paginated datagrid with url params
 * @resources: list of elements
 *  In order to be resolved properly, requires to add an `apiPath` resolve property
 *  corresponding to the api used
 * @paginationNumber: page number
 * @paginationSize: page size
 * @paginationTotalCount: total number of elements
 * @onListParamsChange: callback on params change
 * @filter: filter param
 * @sort: property to sort
 * @sortOrder: ASC or DESC, sorting order
 * @columns: list of basic column configuration to display
 *   In order to be resolved properly, requires to add a :
 *     - `dataModel` resolve property corresponding to the used model in API
 *     - `schema` resolve property corresponding to the schema used for models
 */
export const stateResolves = {
  staticResources: () => false,
  resources: /* @ngInject */ (
    $q,
    $transition$,
    apiPath,
    defaultFilterColumn,
    iceberg,
    staticResources,
  ) => {
    if (!staticResources) {
      const { filter, pageSize, sort, sortOrder } = $transition$.params();
      let { page } = $transition$.params();
      const filtersParsed = JSON.parse(filter);

      const updatedParams = $transition$.paramsChanged();

      // If we've updated the filters but not the page,
      // it means we've only updated the filter in the url then reset page
      // If the page is also updated, this means it comes from a direct url update
      if (updatedParams.filter && !updatedParams.page) {
        page = 1;
      }

      let request = iceberg(apiPath)
        .query()
        .expand('CachedObjectList-Pages')
        .limit(pageSize)
        .offset(page)
        .sort(sort || defaultFilterColumn, sortOrder);

      filtersParsed.forEach(({ field, comparator, reference }) => {
        request = request.addFilter(
          field,
          get(FILTER_OPERATORS, comparator),
          mapFilterForIceberg(comparator, reference),
        );
      });

      return request.execute(null).$promise;
    }

    return $q.resolve({ data: [] });
  },
  schema: /* @ngInject */ ($http, apiPath) =>
    $http.get(`${apiPath}.json`).then(({ data }) => data),
  apiModel: /* @ngInject */ (dataModel, schema) => schema.models[dataModel],
  paginationNumber: /* @ngInject */ (
    $transition$,
    resources,
    staticResources,
  ) => {
    if (staticResources) {
      return $transition$.paramsChanged().filter &&
        !$transition$.paramsChanged().page
        ? 1
        : $transition$.params().page;
    }

    return parseInt(get(resources.headers, 'x-pagination-number'), 10);
  },
  paginationSize: /* @ngInject */ ($transition$, resources, staticResources) =>
    staticResources
      ? $transition$.params().pageSize
      : parseInt(get(resources.headers, 'x-pagination-size'), 10),
  paginationTotalCount: /* @ngInject */ (resources, staticResources) =>
    staticResources
      ? resources.length
      : parseInt(get(resources.headers, 'x-pagination-elements'), 10),

  onListParamsChange: /* @ngInject */ ($state, $transition$) => (params) =>
    $state.go(
      '.',
      {
        ...$transition$.params(),
        ...params,
      },
      {
        notify: false,
      },
    ),

  filter: /* @ngInject */ ($transition$) => $transition$.params().filter,

  sort: /* @ngInject */ ($transition$, defaultFilterColumn) =>
    $transition$.params().sort || defaultFilterColumn,
  sortOrder: /* @ngInject */ ($transition$) => $transition$.params().sortOrder,

  displayedColumns: /* @ngInject */ ($transition$) =>
    JSON.parse($transition$.params().columns),

  configuration: /* @ngInject */ (
    $q,
    $transition$,
    apiModel,
    defaultFilterColumn,
    displayedColumns,
  ) => {
    let config;
    try {
      config = $transition$.injector().getAsync('columnConfig');
    } catch (error) {
      config = $q.resolve(
        getDefaultConfiguration(
          apiModel,
          defaultFilterColumn,
          displayedColumns,
        ),
      );
    }

    return config;
  },
  columns: /* @ngInject */ (
    $transition$,
    configuration,
    apiModel,
    schema,
    sort,
    sortOrder,
  ) => {
    let serviceNameTracker;
    try {
      serviceNameTracker = $transition$.injector().get('serviceNameTracker');
    } catch (error) {
      serviceNameTracker = null;
    }

    return parseConfig(
      configuration.data,
      apiModel,
      schema,
      { sort, sortOrder },
      serviceNameTracker,
    );
  },
  formatters: /* @ngInject */ (configuration) => {
    return configuration.data.reduce(
      (columns, column) => ({
        ...columns,
        ...(column.format
          ? { [column.property]: (value) => column.format(value) }
          : {}),
      }),
      {},
    );
  },

  mappings: /* @ngInject */ (configuration) => {
    return configuration.data.reduce(
      (columns, column) => ({
        ...columns,
        ...(column.map
          ? { [column.property]: (value) => column.map(value) }
          : {}),
      }),
      {},
    );
  },
};

export const stateParams = {
  page: {
    value: '1',
    squash: true,
  },
  pageSize: {
    value: '10',
    squash: true,
  },
  sort: {
    value: null,
    squash: true,
  },
  sortOrder: {
    value: 'ASC',
    squash: true,
  },
  filter: {
    value: '[]',
    squash: true,
  },
  columns: {
    squash: true,
    value: '[]',
    dynamic: true,
  },
};

export const urlQueryParams = Object.keys(stateParams).join('&');

export const componentBindings = mapValues(stateResolves, () => '<');

export default {
  FILTER_OPERATORS,
  mapFilterForIceberg,
  stateResolves,
  stateParams,
  urlQueryParams,
  componentBindings,
  getSorting,
  parseConfig,
  matchingTypes,
  getDefaultConfiguration,
};
