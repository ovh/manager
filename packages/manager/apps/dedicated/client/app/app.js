import { Environment } from '@ovh-ux/manager-config';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import values from 'lodash/values';
import isString from 'lodash/isString';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhBrowserAlert from '@ovh-ux/ng-ovh-browser-alert';
import ngOvhExportCsv from '@ovh-ux/ng-ovh-export-csv';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhOtrs from '@ovh-ux/ng-ovh-otrs';
import ngOvhProxyRequest from '@ovh-ux/ng-ovh-proxy-request';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ngOvhSsoAuthModalPlugin from '@ovh-ux/ng-ovh-sso-auth-modal-plugin';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';
import ngOvhUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import ngQAllSettled from '@ovh-ux/ng-q-allsettled';
import ngTailLogs from '@ovh-ux/ng-tail-logs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngUirouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ovhContacts from '@ovh-ux/ng-ovh-contacts';
import ovhManagerAccountSidebar from '@ovh-ux/manager-account-sidebar';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerBanner from '@ovh-ux/manager-banner';
import ovhManagerEnterpriseCloudDatabase from '@ovh-ux/manager-enterprise-cloud-database';
import ovhManagerDbaasLogs from '@ovh-ux/manager-dbaas-logs';
import ovhManagerMfaEnrollment from '@ovh-ux/mfa-enrollment';
import ovhManagerNasha from '@ovh-ux/manager-nasha';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';
import ovhManagerServerSidebar from '@ovh-ux/manager-server-sidebar';
import ovhManagerSupport from '@ovh-ux/manager-support';
import ovhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import uiRouter, { RejectType } from '@uirouter/angularjs';
import chartjs from 'angular-chart.js';

import moduleExchange from '@ovh-ux/manager-exchange';
import ovhManagerFilters from '@ovh-ux/manager-filters';
import ovhManagerVeeamEnterprise from '@ovh-ux/manager-veeam-enterprise';
import ovhManagerVeeamCloudConnect from '@ovh-ux/manager-veeam-cloud-connect';
import ovhManagerVps from '@ovh-ux/manager-vps';
import ovhManagerVrack from '@ovh-ux/manager-vrack';
import ovhManagerIplb from '@ovh-ux/manager-iplb';
import ovhManagerCloudConnect from '@ovh-ux/manager-cloud-connect';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ovhNotificationsSidebar from '@ovh-ux/manager-notifications-sidebar';
import ovhManagerAccountMigration from '@ovh-ux/manager-account-migration';
import account from './account';
import config from './config/config';
import contactsService from './account/contacts/service/contacts-service.module';
import dedicatedCloud from './dedicatedCloud';
import dedicatedUniverseComponents from './dedicatedUniverseComponents';
import managedBaremetal from './managedBaremetal';
import errorPage from './error';

import dedicatedServer from './dedicated/server';
import userContracts from './user-contracts';

import { TRACKING } from './at-internet.constants';

Environment.setVersion(__VERSION__);

const moduleName = 'App';

angular
  .module(
    moduleName,
    [
      ...get(__NG_APP_INJECTIONS__, Environment.getRegion(), []),
      account,
      ovhManagerAccountSidebar,
      ovhManagerCore,
      'Billing',
      chartjs,
      'controllers',
      contactsService,
      dedicatedCloud,
      dedicatedServer,
      dedicatedUniverseComponents,
      'directives',
      errorPage,
      'filters',
      'internationalPhoneNumber',
      'Module.download',
      Environment.getRegion() === 'CA' ? moduleExchange : undefined,
      managedBaremetal,
      'Module.ip',
      'Module.license',
      'Module.otrs',
      ovhManagerMfaEnrollment,
      'ng.ckeditor',
      'ngMessages',
      ngAtInternet,
      ngAtInternetUiRouterPlugin,
      ngOvhApiWrappers,
      ngOvhBrowserAlert,
      ngOvhFeatureFlipping,
      ngOvhHttp,
      ngOvhOtrs,
      ngOvhProxyRequest,
      ngOvhSsoAuth,
      ngOvhSsoAuthModalPlugin,
      ngOvhSwimmingPoll,
      ngOvhUiRouterLayout,
      ngOvhUserPref,
      ngOvhUtils,
      ngOvhWebUniverseComponents,
      'ngRoute',
      'ngSanitize',
      ngTranslateAsyncLoader,
      ngUirouterLineProgress,
      'oui',
      ngOvhExportCsv,
      ngPaginationFront,
      ngQAllSettled,
      'ovh-angular-responsive-tabs',
      'ovh-api-services',
      ovhManagerAtInternetConfiguration,
      ovhManagerAccountMigration,
      ovhManagerDbaasLogs,
      ovhManagerIplb,
      ovhManagerServerSidebar,
      ovhManagerSupport,
      ovhManagerVeeamEnterprise,
      ovhManagerVeeamCloudConnect,
      ovhNotificationsSidebar,
      ovhManagerFilters,
      ngTailLogs,
      ovhContacts,
      ovhManagerBanner,
      ovhManagerEnterpriseCloudDatabase,
      ovhManagerNasha,
      ovhManagerNavbar,
      ovhManagerVps,
      ovhManagerVrack,
      ovhManagerCloudConnect,
      ovhPaymentMethod,
      'pascalprecht.translate',
      'services',
      'ui.bootstrap',
      'ui.router',
      'ui.select',
      'ui.utils',
      'ui.validate',
      uiRouter,
      'UserAccount',
      userContracts,
      'xeditable',
    ].filter(isString),
  )
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
    REDIRECT_URLS: config.constants.REDIRECT_URLS,
    DEFAULT_LANGUAGE: config.constants.DEFAULT_LANGUAGE,
    FALLBACK_LANGUAGE: config.constants.FALLBACK_LANGUAGE,
    SUPPORT: config.constants.SUPPORT,
  })
  .constant('website_url', config.constants.website_url)
  .config(
    /* @ngInject */ (ovhProxyRequestProvider) => {
      ovhProxyRequestProvider.proxy('$http');
      ovhProxyRequestProvider.pathPrefix('apiv6');
    },
  )
  .config(($locationProvider) => {
    $locationProvider.hashPrefix('');
  })
  .config((tmhDynamicLocaleProvider) => {
    tmhDynamicLocaleProvider.localeLocationPattern(
      'resources/angular/i18n/angular-locale_{{locale}}.js',
    );
  })
  .config((OvhHttpProvider, constants) => {
    set(OvhHttpProvider, 'rootPath', constants.swsProxyPath);
    set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
    set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
    set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
  })
  .config(($urlServiceProvider) => {
    $urlServiceProvider.rules.otherwise('/configuration');
  })
  .config(
    /* @ngInject */ (atInternetConfigurationProvider) => {
      atInternetConfigurationProvider.setConfig(TRACKING);
      atInternetConfigurationProvider.setReplacementRules([
        {
          pattern: /^app/,
          replacement: 'dedicated',
        },
      ]);
    },
  )
  .constant('REGEX', {
    ROUTABLE_BLOCK: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(\d|[1-2]\d|3[0-2]))$/,
    ROUTABLE_IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    ROUTABLE_BLOCK_OR_IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(\d|[1-2]\d|3[0-2]))?$/,
  })
  .run((ssoAuthentication, User) => {
    ssoAuthentication.login().then(() => User.getUser());
  })
  .run(
    /* @ngInject */ (
      $location,
      $rootScope,
      $state,
      $transitions,
      coreConfig,
    ) => {
      $rootScope.$on('$locationChangeStart', () => {
        // eslint-disable-next-line no-param-reassign
        delete $rootScope.isLeftMenuVisible;
      });

      // if query params contains unescaped '<' value then
      // clear query params to avoid html injection
      $transitions.onBefore({}, (transition) => {
        let invalidParams = false;
        values($location.search()).forEach((param) => {
          invalidParams = invalidParams || /</.test(param);
        });
        if (invalidParams) {
          $location.search('');
        }

        const HPC_STATES = [
          'app.hpc',
          'app.dedicatedClouds',
          'veeam-enterprise',
        ];
        const IGNORE_STATES = [
          'app.configuration',
          'app.ip',
          'vrack',
          'cloud-connect',
        ];

        const stateIncludes = Object.keys(transition.$to().includes);

        if (HPC_STATES.some((state) => stateIncludes.includes(state))) {
          $rootScope.$broadcast('switchUniverse', 'hpc');
        } else if (
          !IGNORE_STATES.some((state) => stateIncludes.includes(state))
        ) {
          $rootScope.$broadcast('switchUniverse', 'server');
        }
      });

      // manage restriction on billing section for enterprise account
      // see src/billing/billingApp.js for resolve restriction on billing states
      $transitions.onError({}, (transition) => {
        const error = transition.error();
        if (
          get(error, 'status') === 403 &&
          get(error, 'code') === 'FORBIDDEN_BILLING_ACCESS'
        ) {
          $rootScope.$emit('ovh::sidebar::hide');
          $state.go('app.error', { error });
        }
      });

      $state.defaultErrorHandler((error) => {
        if (error.type === RejectType.ERROR) {
          $rootScope.$emit('ovh::sidebar::hide');
          $state.go(
            'error',
            {
              detail: {
                message: get(error.detail, 'data.message'),
                code: has(error.detail, 'headers')
                  ? error.detail.headers('x-ovh-queryId')
                  : null,
              },
            },
            { location: false },
          );
        }
      });

      set($rootScope, 'worldPart', coreConfig.getRegion());
    },
  )
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
    OtrsPopupProvider.setBaseUrlTickets(
      get(constants, 'REDIRECT_URLS.listTicket', null),
    );
  })
  .run(
    /* @ngInject */ ($translate) => {
      let lang = $translate.use();

      if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
        lang = lang.toLowerCase().replace('_', '-');
      } else {
        [lang] = lang.split('_');
      }

      return import(`script-loader!moment/locale/${lang}.js`).then(() =>
        moment.locale(lang),
      );
    },
  )
  .config(
    /* @ngInject */ (ouiCalendarConfigurationProvider) => {
      const lang = Environment.getUserLanguage();
      return import(`flatpickr/dist/l10n/${lang}.js`)
        .then((module) => {
          ouiCalendarConfigurationProvider.setLocale(module.default[lang]);
        })
        .catch(() => {});
    },
  )
  .constant('UNIVERSE', 'DEDICATED')
  .run(
    /* @ngInject */ ($rootScope, $transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        unregisterHook();
      });
    },
  )
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'app.**' }, () => $translate.refresh());
    },
  )
  .config(
    /* @ngInject */ (ovhFeatureFlippingProvider) => {
      ovhFeatureFlippingProvider.setApplicationName('dedicated');
    },
  );

export default moduleName;
