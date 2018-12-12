import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!jquery.scrollto'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import 'script-loader!moment'; // eslint-disable-line

import angular from 'angular';
import ngAria from 'angular-aria';
import ngMessages from 'angular-messages';
import ngSanitize from 'angular-sanitize';
import 'angular-resource';
import translate from 'angular-translate';
import _ from 'lodash';

import ssoAuth from 'ovh-angular-sso-auth';
import OvhHttp from 'ovh-angular-http';

import core from '@ovh-ux/manager-core';
import overthebox from '@ovh-ux/manager-overthebox';
import freefax from '@ovh-ux/manager-freefax';
import sms from '@ovh-ux/manager-sms';
import welcome from '@ovh-ux/manager-welcome';

import routing from './manager-layout-ovh.routes';
import sidebar from './sidebar';
import navbar from './navbar';

import '@ovh-ux/ovh-angular-contracts';
import 'angular-ui-bootstrap';
import 'at-internet-ui-router-plugin';
import 'ng-at-internet';
import 'ovh-angular-apiv7';
import 'ovh-angular-checkbox-table';
import 'ovh-angular-otrs';
import 'ovh-angular-pagination-front';
import 'ovh-angular-responsive-tabs';
import 'ovh-angular-ui-confirm-modal';
import 'ovh-ui-angular';

import './manager-layout-ovh.scss';
import './manager-layout-ovh.less';

angular
  .module('ovhManager', [
    'atInternetUiRouterPlugin',
    core,
    freefax,
    navbar,
    'ng-at-internet',
    ngAria,
    ngMessages,
    ngSanitize,
    'oui',
    overthebox,
    'ovh-angular-checkbox-table',
    'ovh-angular-otrs',
    'ovh-angular-responsive-tabs',
    'ovh-angular-ui-confirm-modal',
    'ovhAngularContracts',
    'ovh-angular-ui-confirm-modal',
    'ovh-angular-pagination-front',
    OvhHttp,
    sidebar,
    sms,
    ssoAuth,
    translate,
    'ui.bootstrap',
    welcome,
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
    _.set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
    _.set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
    _.set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
  })
  .config((OtrsPopupProvider /* , constants */) => {
    OtrsPopupProvider.setBaseUrlTickets('');
  })
  .config(routing);
