export default class ManagerComponentsFormatDatacenterNameCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.translationPrefix = 'server_datacenter_';
  }

  getFormatedName() {
    const [dcCode, dcNumber] = this.name.split('_');
    if (dcCode && dcNumber) {
      const formatedName = this.$translate.instant(
        `${this.translationPrefix}${dcCode}`,
        {
          number: dcNumber,
        },
      );
      return formatedName.startsWith(this.translationPrefix)
        ? this.name
        : formatedName;
    }
    return this.name;
  }
}
