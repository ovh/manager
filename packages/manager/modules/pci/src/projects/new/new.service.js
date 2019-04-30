export default class PciProjectNewService {
  /* @ngInject */
  constructor(OvhApiCloud, OvhApiMeAgreements, OvhApiMeVoucherAccount) {
    this.OvhApiCloud = OvhApiCloud;
    this.OvhApiMeAgreements = OvhApiMeAgreements;
    this.OvhApiMeVoucherAccount = OvhApiMeVoucherAccount;
  }

  createNewProject(params = {}) {
    return this.OvhApiCloud
      .v6()
      .createProject({}, params)
      .$promise;
  }

  getDlpStatus() {
    return this.OvhApiMeVoucherAccount
      .v6()
      .get({
        voucherAccountId: 'digitallaunchpad',
      })
      .$promise;
  }

  getNewProjectAgreementContract(id) {
    return this.OvhApiMeAgreements
      .v6()
      .contract({
        id,
      })
      .$promise;
  }

  getNewProjectInfo(params = {}) {
    return this.OvhApiCloud
      .v6()
      .createProjectInfo(params)
      .$promise;
  }
}
