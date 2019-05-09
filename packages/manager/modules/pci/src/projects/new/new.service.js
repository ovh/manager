import map from 'lodash/map';

export default class PciProjectNewService {
  /* @ngInject */
  constructor($q, OvhApiCloud, OvhApiMeAgreements, OvhApiMeVoucherAccount) {
    this.$q = $q;
    this.OvhApiCloud = OvhApiCloud;
    this.OvhApiMeAgreements = OvhApiMeAgreements;
    this.OvhApiMeVoucherAccount = OvhApiMeVoucherAccount;
  }

  acceptAgreements(contactList = []) {
    const acceptPromises = map(contactList, contract => this.OvhApiMeAgreements
      .v6()
      .accept({
        id: contract.id,
      }, {}).$promise);

    return this.$q.all(acceptPromises);
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
