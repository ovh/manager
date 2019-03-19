import _ from 'lodash';

export default class PublicCloud {
  /* @ngInject */
  constructor(iceberg) {
    this.iceberg = iceberg;
  }

  getProjects() {
    return this
      .iceberg('/cloud/project')
      .query()
      .expand('CachedObjectList-Cursor')
      .sort('description') // Doesn't work as long as cache is not enabled
      .execute()
      .$promise
      .then(projects => _.sortBy(projects, 'description')); // Fallback
  }
}
