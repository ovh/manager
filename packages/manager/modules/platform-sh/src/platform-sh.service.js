import map from 'lodash/map';

import Project from './project.class';

export default class PlatformShService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    PlatformShMockData,
    WucOrderCartService,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.PlatformShMockData = PlatformShMockData;
    this.WucOrderCartService = WucOrderCartService;
  }

  // getProjects() {
  //   return this.$http
  //     .get(`/1.0/webPaaS/subscription`)
  //     .then((projects) => map(projects.data, (project) => new Project(project)));
  // }

  getProjects() {
    return this.PlatformShMockData
      .getProjects()
      .then((projects) => map(projects, (project) => new Project(project)));
  }

  getProjectDetails(projectId) {
    return this.PlatformShMockData
      .getProjectDetails()
      .then((project) => new Project(project));
  }

  getCapabilities() {
    return this.PlatformShMockData
      .getCapabilities();
  }

  updateName(projectId, name) {
    return this.$q.when(true);
  }

  terminateProject(projectId) {
    return this.$q.when(true);
  }

  getCatalog(ovhSubsidiary) {
    return this.WucOrderCartService.getProductPublicCatalog(
      ovhSubsidiary,
      'webPaaS',
    ).then((catalog) => {
      map(catalog.plans, plan => {
        plan.vcpus = [{
          name: '1 vCPU',
          value: 1,
        }];
        return plan;
      });
      return catalog;
    })
  }
}
