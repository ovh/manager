export default class NetAppVolumesDashboardAclController {
  /* @ngInject */
  constructor($translate, Alerter) {
    this.$translate = $translate;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.selectRow(this.acls.length);
    this.currentAcl = {
      accessType: null,
      accessTo: null,
      accessLevel: null,
    };
  }

  selectRow(index) {
    this.currentEditedRow = index;
  }

  cancelAcl() {
    this.isAdding = false;
    this.selectRow(this.acls.length);
    this.acls.pop();
  }

  addAcl() {
    this.isAdding = true;
    this.currentAcl = {
      accessType: null,
      accessTo: null,
      accessLevel: null,
    };
    this.acls.push({});
    this.selectRow(this.acls.length - 1);
  }

  deleteAclRule({ id }, index) {
    this.isLoading = true;
    return this.deleteAcl(id)
      .then(() => {
        this.acls.splice(index, 1);
        return this.Alerter.success(
          this.$translate.instant('netapp_volumes_acl_add_success'),
        );
      })
      .catch(
        (error) =>
          `${this.Alerter.error(
            this.$translate.instant('netapp_volumes_acl_add_error'),
          )}${error.data}`,
      )
      .finally(() => {
        this.isAdding = false;
        this.isLoading = false;
      });
  }

  saveAcl(index) {
    this.isLoading = true;
    this.acls[index].accessTo = this.currentAcl.accessTo;
    this.acls[index].accessType = this.currentAcl.accessType.value;
    this.acls[index].accessLevel = this.currentAcl.accessLevel.value;
    this.selectRow(this.acls.length);
    return this.createAcl({
      accessLevel: this.currentAcl.accessLevel.value,
      accessTo: this.currentAcl.accessTo,
    })
      .then(({ data: netAppShareACLRule }) => {
        this.acls[index].id = netAppShareACLRule.id;
        return this.Alerter.success(
          this.$translate.instant('netapp_volumes_acl_add_success'),
        );
      })
      .catch((error) => {
        this.cancelAcl();
        return `${this.Alerter.error(
          this.$translate.instant('netapp_volumes_acl_add_error'),
        )}${error.data}`;
      })
      .finally(() => {
        this.isAdding = false;
        this.isLoading = false;
      });
  }

  isValid() {
    return (
      this.currentAcl.accessLevel?.value &&
      this.currentAcl.accessType?.value &&
      this.isIPValid()
    );
  }

  isIPValid() {
    try {
      const [cidr, mask] = this.currentAcl.accessTo.split('/');
      const splittedCidr = cidr.split('.');
      if (splittedCidr.length !== 4) {
        return false;
      }
      if (mask || mask === '') {
        splittedCidr.push(mask);
      }
      return splittedCidr.every(
        (value) => parseInt(value, 10) >= 0 && parseInt(value, 10) < 256,
      );
    } catch (error) {
      return false;
    }
  }
}
