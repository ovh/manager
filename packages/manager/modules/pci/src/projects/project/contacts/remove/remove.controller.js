import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, OvhApiCloud) {
    this.$translate = $translate;
    this.OvhApiCloud = OvhApiCloud;
  }

  $onInit() {
    this.isDeleting = false;
  }

  remove() {
    this.isDeleting = true;
    return this.OvhApiCloud
      .Project()
      .Acl()
      .v6()
      .remove({
        serviceName: this.projectId,
        accountId: this.contactId,
      })
      .$promise
      .then(() => this.goToContactsPage(
        this.$translate.instant('cpb_rights_table_rights_remove_success'),
      ))
      .catch(error => this.goToContactsPage(
        this.$translate.instant('cpb_rights_remove_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }
}
