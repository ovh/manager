export default class PciProjectNewService {
  /* @ngInject */
  constructor(OvhApiCloud, OvhApiMeAgreements, OvhApiMeVoucherAccount, ovhContacts) {
    this.OvhApiCloud = OvhApiCloud;
    this.OvhApiMeAgreements = OvhApiMeAgreements;
    this.OvhApiMeVoucherAccount = OvhApiMeVoucherAccount;
    this.ovhContacts = ovhContacts;
  }

  createNewProject(params = {}) {
    return this.OvhApiCloud
      .v6()
      .createProject({}, params)
      .$promise;
  }

  getBillingContact() {
    return this.ovhContacts
      .findMatchingContactFromNic()
      .then((contact) => {
        if (!contact.id) {
          return this.ovhContacts
            .createContact(contact);
        }

        return contact;
      });
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
