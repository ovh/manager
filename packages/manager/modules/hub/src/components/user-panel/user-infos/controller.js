import capitalize from 'lodash/capitalize';
import toUpper from 'lodash/toUpper';

export default class ManagerHubUserInfosCtrl {
  /* @ngInject */
  constructor($q, ssoAuthentication, OvhApiMe) {
    this.$q = $q;
    this.ssoAuthentication = ssoAuthentication;
    this.OvhApiMe = OvhApiMe;
  }

  $onInit() {
    this.isExpanded = false;
    return this.$q.all([this.fetchMe(), this.fetchSupportLevel()]);
  }

  fetchMe() {
    if (this.me) {
      return this.$q.when(this.me);
    }
    return this.OvhApiMe.v6()
      .get()
      .$promise.then((me) => {
        this.me = me;
      });
  }

  fetchSupportLevel() {
    if (this.supportLevel) {
      return this.$q.when(this.supportLevel);
    }
    return this.OvhApiMe.v6()
      .supportLevel()
      .$promise.then((supportLevel) => {
        this.supportLevel = supportLevel;
      });
  }

  getNameInitials() {
    return toUpper(`${this.me.firstname[0]}${this.me.name[0]}`);
  }

  getDisplayName() {
    return `${capitalize(this.me.firstname)} ${capitalize(this.me.name)}`;
  }

  getDisplayNicHandle() {
    return toUpper(this.me.nichandle.replace(/-ovh$/, ''));
  }

  logout() {
    return this.ssoAuthentication.logout();
  }
}
