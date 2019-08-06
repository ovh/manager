import endsWith from 'lodash/endsWith';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';

export default class CloudProjectBillingRightsAddCtrl {
  /* @ngInject */
  constructor(
    $translate,
    OvhApiCloud,
  ) {
    this.$translate = $translate;
    this.OvhApiCloud = OvhApiCloud;
  }

  $onInit() {
    this.isAdding = false;
    this.availableRights = [{
      type: 'readOnly',
      label: this.$translate.instant('cpb_rights_table_rights_value_readOnly'),
    }, {
      type: 'readWrite',
      label: this.$translate.instant('cpb_rights_table_rights_value_readWrite'),
    }];
    [this.right] = this.availableRights;
    this.isUSorCA = indexOf(['US', 'CA'], this.user.country.toUpperCase()) >= 0;
  }

  add() {
    this.isAdding = true;
    return this.OvhApiCloud.Project().Acl().v6().add({
      serviceName: this.projectId,
    }, {
      accountId: this.constructor.normalizedNic(this.right.contact),
      type: this.right.type,
    })
      .$promise
      .then(() => this.goToContactsPage(
        this.$translate.instant('cpb_rights_table_rights_add_success'),
      ))
      .catch(error => this.goToContactsPage(
        this.$translate.instant('cpb_rights_add_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }

  /**
   * Returns the NIC with "-ovh" appended if it was not the case.
   */
  static normalizedNic(name) {
    // check if the NIC is not an email (it could be the case for US users)
    if (/[@.]+/.test(name)) {
      return name;
    }
    return endsWith(name, '-ovh') ? name : `${name}-ovh`;
  }
}
