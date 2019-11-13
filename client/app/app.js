import { Environment } from '@ovh-ux/manager-config';
import _ from 'lodash';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhChatbot from '@ovh-ux/ng-ovh-chatbot';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhOtrs from '@ovh-ux/ng-ovh-otrs';
import ngOvhProxyRequest from '@ovh-ux/ng-ovh-proxy-request';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ngOvhSsoAuthModalPlugin from '@ovh-ux/ng-ovh-sso-auth-modal-plugin';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';
import ngOvhUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngUirouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ovhContacts from '@ovh-ux/ng-ovh-contacts';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerBanner from '@ovh-ux/manager-banner';
import ovhManagerEnterpriseCloudDatabase from '@ovh-ux/manager-enterprise-cloud-database';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';
import ovhManagerServerSidebar from '@ovh-ux/manager-server-sidebar';
import ovhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import uiRouter, { RejectType } from '@uirouter/angularjs';

import config from './config/config';
import contactsService from './account/contacts/service/contacts-service.module';
import dedicatedCloudDatacenterDrp from './dedicatedCloud/datacenter/drp';
import dedicatedCloudDatacenterDashboardDeleteDrp from './dedicatedCloud/datacenter/dashboard/deleteDrp';
import dedicatedUniverseComponents from './dedicatedUniverseComponents';
import errorPage from './error/error.module';
import ovhManagerPccDashboard from './dedicatedCloud/dashboard';
import ovhManagerPccResourceUpgrade from './dedicatedCloud/resource/upgrade';
import preload from './components/manager-preload/manager-preload.module';

import dedicatedServerBandwidth from './dedicated/server/bandwidth/bandwidth.module';
import dedicatedServerInterfaces from './dedicated/server/interfaces/interfaces.module';
import dedicatedServerServers from './dedicated/server/servers/servers.module';
import mfaEnrollment from './mfaEnrollment/mfaEnrollment.module';


Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('App', [
    __NG_APP_INJECTIONS__,
    ovhManagerCore,
    'Billing',
    'chart.js',
    'controllers',
    contactsService,
    dedicatedCloudDatacenterDrp,
    dedicatedServerBandwidth,
    dedicatedServerInterfaces,
    dedicatedCloudDatacenterDashboardDeleteDrp,
    dedicatedServerServers,
    dedicatedUniverseComponents,
    'directives',
    errorPage,
    'filters',
    'internationalPhoneNumber',
    'Module.download',
    ['eu', 'ca'].includes(WEBPACK_ENV.region) ? 'Module.exchange' : undefined,
    'Module.ip',
    'Module.license',
    'Module.otrs',
    mfaEnrollment,
    'ngCkeditor',
    'ngMessages',
    ngAtInternet,
    ngAtInternetUiRouterPlugin,
    ngOvhApiWrappers,
    ngOvhChatbot,
    ngOvhHttp,
    ngOvhOtrs,
    ngOvhProxyRequest,
    ngOvhSsoAuth,
    ngOvhSsoAuthModalPlugin,
    ngOvhSwimmingPoll,
    ngOvhUiRouterLayout,
    ngOvhUserPref,
    ngOvhWebUniverseComponents,
    'ngRoute',
    'ngSanitize',
    ngTranslateAsyncLoader,
    ngUirouterLineProgress,
    'oui',
    'ovh-angular-export-csv',
    'ovh-angular-pagination-front',
    'ovh-angular-q-allSettled',
    'ovh-angular-responsive-tabs',
    ovhManagerPccDashboard,
    ovhManagerPccResourceUpgrade,
    ovhManagerServerSidebar,
    'ovh-angular-tail-logs',
    'ovh-utils-angular',
    'ovhBrowserAlert',
    ovhContacts,
    ovhManagerBanner,
    ovhManagerEnterpriseCloudDatabase,
    ovhManagerNavbar,
    ovhPaymentMethod,
    'pascalprecht.translate',
    preload,
    'services',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'ui.utils',
    'ui.validate',
    uiRouter,
    'UserAccount',
    'xeditable',
  ].filter(_.isString))
  .constant('constants', {
    prodMode: config.prodMode,
    swsProxyRootPath: config.swsProxyRootPath,
    aapiRootPath: config.aapiRootPath,
    target: config.target,
    renew: config.constants.RENEW_URL,
    urls: config.constants.URLS,
    UNIVERS: config.constants.UNIVERS,
    TOP_GUIDES: config.constants.TOP_GUIDES,
    vmsUrl: config.constants.vmsUrl,
    travauxUrl: config.constants.travauxUrl,
    aapiHeaderName: 'X-Ovh-Session',
    vrackUrl: config.constants.vrackUrl,
    MANAGER_URLS: config.constants.MANAGER_URLS,
    REDIRECT_URLS: config.constants.REDIRECT_URLS,
    DEFAULT_LANGUAGE: config.constants.DEFAULT_LANGUAGE,
    FALLBACK_LANGUAGE: config.constants.FALLBACK_LANGUAGE,
    SUPPORT: config.constants.SUPPORT,
  })
  .constant('website_url', config.constants.website_url)
  .config(/* @ngInject */(ovhProxyRequestProvider) => {
    ovhProxyRequestProvider.proxy('$http');
    ovhProxyRequestProvider.pathPrefix('apiv6');
  })
  .config(($locationProvider) => {
    $locationProvider.hashPrefix('');
  })
  .config((tmhDynamicLocaleProvider) => {
    tmhDynamicLocaleProvider.localeLocationPattern('resources/angular/i18n/angular-locale_{{locale}}.js');
  })
  .config((OvhHttpProvider, constants) => {
    _.set(OvhHttpProvider, 'rootPath', constants.swsProxyPath);
    _.set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
    _.set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
    _.set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
  })
  .config(($urlServiceProvider) => {
    $urlServiceProvider.rules.otherwise('/configuration');
  })
  /* ========== AT-INTERNET ========== */
  .config((atInternetProvider, atInternetUiRouterPluginProvider, constants) => {
    atInternetProvider.setEnabled(constants.prodMode && window.location.port.length <= 3);
    atInternetProvider.setDebug(!constants.prodMode);

    atInternetUiRouterPluginProvider.setTrackStateChange(constants.prodMode
      && window.location.port.length <= 3);
    atInternetUiRouterPluginProvider.addStateNameFilter(routeName => (routeName ? routeName.replace(/^app/, 'dedicated').replace(/\./g, '::') : ''));
  })
  .constant('REGEX', {
    ROUTABLE_BLOCK: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(\d|[1-2]\d|3[0-2]))$/,
    ROUTABLE_IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    ROUTABLE_BLOCK_OR_IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(\d|[1-2]\d|3[0-2]))?$/,
  })
  .run((ssoAuthentication, User) => {
    ssoAuthentication.login().then(() => User.getUser());
  })
  .run(/* @ngInject */ ($rootScope, $state, $transitions, coreConfig) => {
    $rootScope.$on('$locationChangeStart', () => {
      delete $rootScope.isLeftMenuVisible; // eslint-disable-line
    });

    // manage restriction on billing section for enterprise account
    // see src/billing/billingApp.js for resolve restriction on billing states
    $transitions.onError({}, (transition) => {
      const error = transition.error();
      if (_.get(error, 'status') === 403 && _.get(error, 'code') === 'FORBIDDEN_BILLING_ACCESS') {
        $state.go('app.error', { error });
      }
    });

    $state.defaultErrorHandler((error) => {
      if (error.type === RejectType.ERROR) {
        $state.go('error', {
          detail: {
            message: _.get(error.detail, 'data.message'),
            code: _.has(error.detail, 'headers') ? error.detail.headers('x-ovh-queryId') : null,
          },
        }, { location: false });
      }
    });

    _.set($rootScope, 'worldPart', coreConfig.getRegion());
  })
  .run(($location) => {
    const queryParams = $location.search();

    if (queryParams && queryParams.redirectTo) {
      $location.path(queryParams.redirectTo);
      delete queryParams.redirectTo;
      $location.search(queryParams);
    }
  })
  .run((storage) => {
    storage.setKeyPrefix('com.ovh.univers.dedicated.');
  })
  .run((zendesk) => {
    zendesk.init();
  })
  .config(($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  })
  .config((OtrsPopupProvider, constants) => {
    OtrsPopupProvider.setBaseUrlTickets(_.get(constants, 'REDIRECT_URLS.listTicket', null));
  })
  .run(($translate) => {
    moment.locale(_.first($translate.use().split('_')));
  })
  .run((constants, atInternet, OvhApiMe) => {
    const level2 = constants.target === 'US' ? '57' : '10';

    OvhApiMe.v6().get().$promise
      .then((me) => {
        atInternet.setDefaults({
          level2,
          countryCode: me.country,
          currencyCode: me.currency && me.currency.code,
          visitorId: me.customerCode,
        });
      });
  })
  .constant('UNIVERSE', 'DEDICATED');
