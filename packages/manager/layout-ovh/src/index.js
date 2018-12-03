import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import 'script-loader!moment'; // eslint-disable-line

import angular from 'angular';
import ngAria from 'angular-aria';
import ngSanitize from 'angular-sanitize';
import 'angular-resource';
import translate from 'angular-translate';
import _ from 'lodash';

import ssoAuth from 'ovh-angular-sso-auth';
import OvhHttp from 'ovh-angular-http';

import telecomUniverseComponents from '@ovh-ux/telecom-universe-components';

import core from '@ovh-ux/manager-core';
import overthebox from '@ovh-ux/manager-overthebox';
import freefax from '@ovh-ux/manager-freefax';
import welcome from '@ovh-ux/manager-welcome';

import routing from './manager-layout-ovh.routes';
import sidebar from './sidebar';
import navbar from './navbar';

import 'angular-ui-bootstrap';
import 'ovh-angular-otrs';
import 'ovh-angular-apiv7';
import 'ovh-ui-angular';

import '@ovh-ux/ovh-angular-contracts';
import 'ovh-angular-responsive-tabs';
import 'ovh-angular-ui-confirm-modal';

import './manager-layout-ovh.scss';
import './manager-layout-ovh.less';

angular
  .module('ovhManager', [
    core,
    freefax,
    navbar,
    ngAria,
    ngSanitize,
    'oui',
    overthebox,
    'ovh-angular-otrs',
    'ovh-angular-responsive-tabs',
    'ovh-angular-tail-logs',
    'ovh-angular-ui-confirm-modal',
    'ovhAngularContracts',
    'ovh-angular-ui-confirm-modal',
    OvhHttp,
    sidebar,
    ssoAuth,
    telecomUniverseComponents,
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
