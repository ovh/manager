import toUpper from 'lodash/toUpper';

import { Environment } from '@ovh-ux/manager-config';
import { EXCLUDED_ROLES } from './constants';

export default class ManagerHubUserInfosCtrl {
  /* @ngInject */
  constructor($http, $q, atInternet, RedirectionService, ssoAuthentication) {
    this.$http = $http;
    this.$q = $q;
    this.atInternet = atInternet;
    this.ssoAuthentication = ssoAuthentication;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.userAccountUrl = this.RedirectionService.getURL('userAccount');

    if (!this.me) {
      this.me = Environment.getUser();
    }
    if (!this.supportLevel) {
      this.supportLevel = this.me.supportLevel;
    }
    if (!EXCLUDED_ROLES.includes(this.me.auth.method)) {
      this.role = this.me.auth.method;
    }
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
