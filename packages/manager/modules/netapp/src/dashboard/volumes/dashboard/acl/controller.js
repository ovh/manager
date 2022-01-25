export default class NetAppVolumesDashboardAclController {
  /* @ngInject */
  constructor($translate, Alerter) {
    this.$translate = $translate;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.selectRow(this.acls.length);
    this.initAclModel();
  }

  selectRow(index) {
    this.currentEditedRow = index;
  }

  cancelAcl() {
    this.trackClick('add::cancel');

    this.isAdding = false;
    this.acls.pop();
    this.selectRow(this.acls.length);
  }

  initAclModel() {
    const aclTypes = this.shareACLTypeEnum;

    this.currentAcl = {
      accessType: aclTypes.length === 1 ? aclTypes[0] : null,
      accessTo: null,
      accessLevel: null,
    };
  }

  addAcl() {
    this.trackClick('add');

    this.isAdding = true;

    this.initAclModel();
    this.acls.push({});
    this.selectRow(this.acls.length - 1);
  }

  deleteAclRule({ id }, index) {
    this.trackClick('delete');

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
    this.trackClick('add::confirm');

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

  isValid(aclIndex) {
    return (
      this.currentAcl.accessLevel?.value &&
      this.currentAcl.accessType?.value &&
      !this.isIPDuplicate(aclIndex) &&
      this.isIPValid()
    );
  }

  isIPDuplicate(aclIndex) {
    const existingAcls = this.acls.slice(0, aclIndex);
    return existingAcls.some(
      ({ accessTo }) => accessTo === this.currentAcl.accessTo,
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
