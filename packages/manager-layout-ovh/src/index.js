import angular from 'angular';
import ngAria from 'angular-aria';
import ngSanitize from 'angular-sanitize';
import translate from 'angular-translate';
import set from 'lodash/set';

import ssoAuth from 'ovh-angular-sso-auth';
import OvhHttp from 'ovh-angular-http';

import core from '@ovh-ux/manager-core';
import welcome from '@ovh-ux/manager-welcome';

import routing from './manager-layout-ovh.routes';
import sidebar from './sidebar';
import navbar from './navbar';

import 'ovh-angular-otrs';
import 'ovh-angular-apiv7';
import 'ovh-ui-angular';
import 'bootstrap';

import './manager-layout-ovh.less';
import './manager-layout-ovh.scss';

angular
  .module('ovhManager', [
    core,
    welcome,
    ngAria,
    ngSanitize,
    'oui',
    'ovh-angular-otrs',
    sidebar,
    ssoAuth,
    OvhHttp,
    translate,
    navbar,
  ])
  .run((ssoAuthentication/* , User */) => {
    ssoAuthentication.login(); // .then(() => User.getUser());
  })
  .constant('OVH_SSO_AUTH_LOGIN_URL', '/auth')
  .factory('serviceTypeInterceptor', () => ({
    request(config) {
      const localConfig = config;
      if (/^(\/?engine\/)?2api(-m)?\//.test(localConfig.url)) {
        localConfig.url = localConfig.url.replace(/^(\/?engine\/)?2api(-m)?/, '');
        localConfig.serviceType = 'aapi';
      }

      if (/^apiv6\//.test(localConfig.url)) {
        localConfig.url = localConfig.url.replace(/^apiv6/, '');
        localConfig.serviceType = 'apiv6';
      }

      if (/^apiv7\//.test(localConfig.url)) {
        localConfig.url = localConfig.url.replace(/^apiv7/, '');
        localConfig.serviceType = 'apiv7';
      }

      return localConfig;
    },
  }))
  .config((ssoAuthenticationProvider, $httpProvider, OVH_SSO_AUTH_LOGIN_URL) => {
    ssoAuthenticationProvider.setLoginUrl(OVH_SSO_AUTH_LOGIN_URL);
    ssoAuthenticationProvider.setLogoutUrl(`${OVH_SSO_AUTH_LOGIN_URL}?action=disconnect`);

    // if (!constants.prodMode) {
    ssoAuthenticationProvider.setUserUrl('/engine/apiv6/me');
    // }

    ssoAuthenticationProvider.setConfig([
      {
        serviceType: 'apiv6',
        urlPrefix: '/engine/apiv6',
      },
      {
        serviceType: 'aapi',
        urlPrefix: '/engine/2api',
      },
      {
        serviceType: 'apiv7',
        urlPrefix: '/engine/apiv7',
      },
    ]);

    $httpProvider.interceptors.push('serviceTypeInterceptor');
    $httpProvider.interceptors.push('ssoAuthInterceptor');
  })
  .config((OvhHttpProvider) => {
    // OvhHttpProvider.rootPath = constants.swsProxyPath;
    set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
    set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
    set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
  })
  .config((OtrsPopupProvider /* , constants */) => {
    OtrsPopupProvider.setBaseUrlTickets('');
  })
  .config(routing);
