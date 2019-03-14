import _ from 'lodash';

export default /* @ngInject */ class PublicCloud {
  constructor(iceberg) {
    this.iceberg = iceberg;
  }

  getProjects() {
    return this
      .iceberg('/cloud/project')
      .query()
      .expand('CachedObjectList-Cursor')
      .sort('description') // Doesn't work as long as cache is not enaled
      .execute()
      .$promise
      .then(projects => _.sortBy(projects, 'description')); // Fallback
  }
}
