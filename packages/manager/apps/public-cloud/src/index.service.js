import sortBy from 'lodash/sortBy';

export default class PublicCloud {
  /* @ngInject */
  constructor(coreConfig, iceberg, OvhApiCloudProject) {
    this.coreConfig = coreConfig;
    this.iceberg = iceberg;
    this.OvhApiCloudProject = OvhApiCloudProject;
  }

  getProjects(filters = []) {
    // Don't have Iceberg in US -> Fallback by ovh-api-services
    if (this.coreConfig.isRegion('US')) {
      return this.OvhApiCloudProject
        .v6()
        .queryDetails()
        .then(projects => sortBy(projects, 'description'));
    }

    // Use Iceberg
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
      .$promise;
  }
}
