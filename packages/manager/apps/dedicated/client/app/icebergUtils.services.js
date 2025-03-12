import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

const moduleName = 'ovhManagerDedicatedIcebergUtilsServices';
export const name = 'icerbergUtils';

class IcebergUtilsServices {
  /* @ngInject */
  constructor($q, iceberg) {
    this.iceberg = iceberg;
    this.$q = $q;
  }

  /* ------- ICEBERG -------*/
  icebergQuery(url, paginationParams, urlParams) {
    const {
      filters,
      pageSize,
      offset,
      sort,
      sortOrder,
      defaultFilterColumn,
      isCacheDisabled,
    } = paginationParams;

    let request = this.iceberg(url, urlParams)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(Math.ceil(offset / (pageSize || 1)))
      .sort(sort || defaultFilterColumn, sortOrder);

    if (filters?.length > 0) {
      request = IcebergUtilsServices.constructor.filterIceberg(
        request,
        filters,
      );
    }

    return this.$q
      .resolve(
        request.execute(
          urlParams,
          isCacheDisabled ? { headers: { Pragma: 'no-cache' } } : true,
        ).$promise,
      )
      .then(({ data, headers }) => ({
        data,
        meta: {
          totalCount: headers['x-pagination-elements'],
        },
      }));
  }

  static filterIceberg(request, filters) {
    let filterRequest = request;
    filters.forEach(({ field, comparator, reference }) => {
      filterRequest = filterRequest.addFilter(
        field,
        ListLayoutHelper.FILTER_OPERATORS[comparator],
        ListLayoutHelper.mapFilterForIceberg(comparator, reference),
      );
    });
    return filterRequest;
  }
}

angular.module(moduleName, []).service(name, IcebergUtilsServices);

export default moduleName;
