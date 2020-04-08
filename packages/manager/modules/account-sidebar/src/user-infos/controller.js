import toUpper from 'lodash/toUpper';

import { EXCLUDED_ROLES } from './constants';

export default class ManagerHubUserInfosCtrl {
  /* @ngInject */
  constructor(
    $http,
    $q,
    atInternet,
    OvhApiMe,
    RedirectionService,
    ssoAuthentication,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.atInternet = atInternet;
    this.OvhApiMe = OvhApiMe;
    this.ssoAuthentication = ssoAuthentication;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.userAccountUrl = this.RedirectionService.getURL('userAccount');
    return this.$q.all([
      this.fetchRole(),
      this.fetchMe(),
      this.fetchSupportLevel(),
    ]);
  }

  fetchMe() {
    return this.$q
      .when(this.me ? this.me : this.OvhApiMe.v6().get().$promise)
      .then((me) => {
        this.me = me;
      });
  }

  fetchSupportLevel() {
    if (this.supportLevel) {
      return this.$q.when(this.supportLevel);
    }
    this.loading = true;
    return this.OvhApiMe.v6()
      .supportLevel()
      .$promise.then((supportLevel) => {
        this.supportLevel = supportLevel;
      })
      .catch(() => {
        this.supportLevel = null;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  fetchRole() {
    return this.$http.get('/auth/details').then(({ data }) => {
      if (!EXCLUDED_ROLES.includes(data.method)) {
        this.role = data.method;
      }
    });
  }

  getNameInitials() {
    return toUpper(`${this.me.firstname[0]}${this.me.name[0]}`);
  }

  getDisplayName() {
    return `${this.me.firstname} ${this.me.name}`;
  }

  logout() {
    this.atInternet.trackClick({
      name: 'hub::sidebar::profile::go-to-log-out',
      type: 'action',
    });
    return this.ssoAuthentication.logout();
  }
}
