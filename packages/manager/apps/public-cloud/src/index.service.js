import _ from 'lodash';

export default class PublicCloud {
  /* @ngInject */
  constructor(iceberg) {
    this.iceberg = iceberg;
  }

  getProjects(filters = []) {
    return filters.reduce(
      (promise, {
        field,
        comparator,
        reference,
      }) => promise.addFilter(field, comparator, reference),
      this
        .iceberg('/cloud/project')
        .query()
        .expand('CachedObjectList-Cursor'),
    )
      .sort('description') // Doesn't work as long as cache is not enabled
      .execute()
      .$promise
      .then(projects => _.sortBy(projects, 'description')); // Fallback
  }
}
