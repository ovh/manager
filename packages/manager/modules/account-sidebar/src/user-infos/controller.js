import toUpper from 'lodash/toUpper';

import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import { EXCLUDED_ROLES } from './constants';

export default class ManagerHubUserInfosCtrl {
  /* @ngInject */
  constructor($http, $q, atInternet, coreConfig, ssoAuthentication) {
    this.$http = $http;
    this.$q = $q;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.ssoAuthentication = ssoAuthentication;
  }

  $onInit() {
    this.userAccountUrl = buildURL('dedicated', '#/useraccount/dashboard');

    if (!this.me) {
      this.me = this.coreConfig.getUser();
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
