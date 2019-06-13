export default class ProjectsController {
  /* @ngInject */
  constructor(OvhApiCloudProject, projects) {
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.projects = projects;
  }

  loadRow({ serviceName }) {
    return this.OvhApiCloudProject
      .v6()
      .get({ serviceName })
      .$promise;
  }
}
