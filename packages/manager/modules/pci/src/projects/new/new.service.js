export default class PciProjectNewService {
  /* @ngInject */
  constructor(OvhApiCloud) {
    this.OvhApiCloud = OvhApiCloud;
  }

  getNewProjectInfo() {
    return this.OvhApiCloud
      .v6()
      .createProjectInfo()
      .$promise;
  }
}
