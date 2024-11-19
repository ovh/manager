export default class DomainContactEditCtrl {
  /* @ngInject */
  constructor($stateParams) {
    this.contactId = $stateParams.contactId;
    this.contactInformations = $stateParams.contactInformations;
  }

}
