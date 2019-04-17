export default class {
  /* @ngInject */
  constructor(
    OvhApiCloudProjectKube,
    OvhApiKube,
  ) {
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.OvhApiKube = OvhApiKube;
  }

  getProjectKubernetes(projectId) {
    return this.OvhApiCloudProjectKube.Aapi().query({ serviceName: projectId }).$promise;
  }

  getKubernetes(serviceName) {
    return this.OvhApiKube.v6().get({ serviceName }).$promise;
  }
}
