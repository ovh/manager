import get from 'lodash/get';
import mapValues from 'lodash/mapValues';

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
        return `%25${val}%25`;
      case 'STARTSWITH':
        return `${val}%25`;
      case 'ENDSWITH':
        return `%25${val}`;
      default:
        return val;
    }
  });

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
 */
export const stateResolves = {
  resources: /* @ngInject */ ($transition$, apiPath, iceberg) => {
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
      .sort(sort, sortOrder);

    filtersParsed.forEach(({ field, comparator, reference }) => {
      request = request.addFilter(
        field,
        get(FILTER_OPERATORS, comparator),
        mapFilterForIceberg(comparator, reference),
      );
    });

    return request.execute(null).$promise;
  },

  paginationNumber: /* @ngInject */ (resources) =>
    parseInt(get(resources.headers, 'x-pagination-number'), 10),
  paginationSize: /* @ngInject */ (resources) =>
    parseInt(get(resources.headers, 'x-pagination-size'), 10),
  paginationTotalCount: /* @ngInject */ (resources) =>
    parseInt(get(resources.headers, 'x-pagination-elements'), 10),
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

  sort: /* @ngInject */ ($transition$) => $transition$.params().sort,
  sortOrder: /* @ngInject */ ($transition$) => $transition$.params().sortOrder,
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
    value: 'name',
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
};
