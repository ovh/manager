export default class PciProjectNewService {
  /* @ngInject */
  constructor(OvhApiCloud, OvhApiMeAgreements) {
    this.OvhApiCloud = OvhApiCloud;
    this.OvhApiMeAgreements = OvhApiMeAgreements;
  }

  createNewProject(params = {}) {
    return this.OvhApiCloud
      .v6()
      .createProject({}, params)
      .$promise;
  }

  getNewProjectAgreementContract(agreementId) {
    return this.OvhApiMeAgreements
      .v6()
      .contract({
        id: agreementId,
      })
      .$promise;
  }

  getNewProjectInfo() {
    return this.OvhApiCloud
      .v6()
      .createProjectInfo()
      .$promise;
  }
}
