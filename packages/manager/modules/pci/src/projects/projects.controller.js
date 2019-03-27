import map from 'lodash/map';

export default class ProjectsController {
  /* @ngInject */
  constructor(OvhApiCloudProject) {
    this.OvhApiCloudProject = OvhApiCloudProject;
  }

  loadPartialData({ offset, pageSize }) {
    return this.OvhApiCloudProject
      .v6()
      .query()
      .$promise
      .then(projects => map(projects, serviceName => ({ serviceName })))
      .then(data => ({
        data: data.slice(offset - 1, offset + pageSize - 1),
        meta: {
          totalCount: data.length,
          currentOffset: offset,
          pageCount: Math.ceil(data.length / pageSize),
          pageSize,
        },
      }));
  }

  loadRow({ serviceName }) {
    return this.OvhApiCloudProject
      .v6()
      .get({ serviceName })
      .$promise;
  }
}
