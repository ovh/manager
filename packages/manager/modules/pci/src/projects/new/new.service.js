import map from 'lodash/map';

export default class PciProjectNewService {
  /* @ngInject */
  constructor($q, OvhApiCloud, OvhApiMeAgreements, OvhApiMeVoucherAccount,
    OvhApiOrderCatalogPublic) {
    this.$q = $q;
    this.OvhApiCloud = OvhApiCloud;
    this.OvhApiMeAgreements = OvhApiMeAgreements;
    this.OvhApiMeVoucherAccount = OvhApiMeVoucherAccount;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
  }

  acceptAgreements(contactList = []) {
    const acceptPromises = map(contactList, ({ id }) => this.OvhApiMeAgreements
      .v6()
      .accept({
        id,
      }, {}).$promise);

    return this.$q.all(acceptPromises);
  }

  cancelProjectCreation(projectId) {
    return this.OvhApiCloud.Project()
      .v6()
      .cancelCreation({
        serviceName: projectId,
      }, {})
      .$promise;
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

  getFormattedCatalog(ovhSubsidiary) {
    return this.OvhApiOrderCatalogPublic
      .v6()
      .get({
        productName: 'cloud',
        ovhSubsidiary,
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

  getProject(serviceName) {
    return this.OvhApiCloud.Project()
      .v6()
      .get({
        serviceName,
      })
      .$promise;
  }
}
