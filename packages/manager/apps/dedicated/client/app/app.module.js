/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'script-loader!moment/min/moment.min.js';
import 'script-loader!es6-shim/es6-shim.min.js';
import 'script-loader!components-jqueryui/ui/minified/version.js';
import 'script-loader!components-jqueryui/ui/minified/plugin.js';
import 'script-loader!components-jqueryui/ui/minified/widget.js';
import 'script-loader!components-jqueryui/ui/minified/data.js';
import 'script-loader!components-jqueryui/ui/minified/scroll-parent.js';
import 'script-loader!components-jqueryui/ui/minified/safe-active-element.js';
import 'script-loader!components-jqueryui/ui/minified/safe-blur.js';
import 'script-loader!components-jqueryui/ui/widgets/mouse.js';
import 'script-loader!components-jqueryui/ui/widgets/sortable.js';
import 'script-loader!components-jqueryui/ui/widgets/draggable.js';
import 'angular';
import 'angular-xeditable';
import '@ovh-ux/ui-kit';
import 'angular-route';
import 'angular-sanitize';
import 'angular-cookies';
import 'angular-messages';
import 'script-loader!jquery.scrollto/jquery.scrollTo.min.js';
import 'bootstrap';
import 'angular-ui-bootstrap';
import 'angularjs-scroll-glue';
import 'script-loader!angular-dynamic-locale/dist/tmhDynamicLocale.js';
import 'punycode';
import 'script-loader!urijs/src/URI.min.js';
import 'script-loader!ipaddr.js/ipaddr.min.js';
import 'script-loader!validator/validator.min.js';
import 'script-loader!angular-ui-utils/ui-utils.min.js';
import 'script-loader!angular-ui-validate/dist/validate.min.js';
import 'script-loader!randexp/build/randexp.min';
import 'script-loader!ui-select/dist/select.min.js';
import 'angular-resource';
import 'script-loader!jsurl/lib/jsurl.js';
import 'script-loader!international-phone-number/releases/international-phone-number.min.js';
import 'script-loader!u2f-api-polyfill/u2f-api-polyfill.js';
import 'ovh-api-services';
import 'angular-translate';
import 'script-loader!angular-translate/dist/angular-translate-loader-partial/angular-translate-loader-partial.min.js';
import 'ng-slide-down';
import '@ovh-ux/ng-ovh-actions-menu';
import 'script-loader!matchmedia-ng/matchmedia-ng.js';
import 'angular-aria';
import 'script-loader!chart.js/dist/Chart.min.js';
import 'script-loader!messenger/build/js/messenger.min.js';
import 'script-loader!filesize/lib/filesize.js';
import 'script-loader!angular-websocket/dist/angular-websocket';

import './app.less';
import './css/source.scss';
/* eslint-enable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */

import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import values from 'lodash/values';
import isString from 'lodash/isString';
import trustedNic from '@ovh-ux/manager-trusted-nic';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhBrowserAlert from '@ovh-ux/ng-ovh-browser-alert';
import ngOvhExportCsv from '@ovh-ux/ng-ovh-export-csv';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
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
import { registerCoreModule } from '@ovh-ux/manager-core';
import ovhManagerCookiePolicy from '@ovh-ux/manager-cookie-policy';
import ovhManagerBanner from '@ovh-ux/manager-banner';
import ovhManagerBilling from '@ovh-ux/manager-billing';
import ovhManagerEnterpriseCloudDatabase from '@ovh-ux/manager-enterprise-cloud-database';
import ovhManagerDbaasLogs from '@ovh-ux/manager-dbaas-logs';
import ovhManagerMfaEnrollment from '@ovh-ux/mfa-enrollment';
import ovhManagerNasha from '@ovh-ux/manager-nasha';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';
import ovhManagerNetapp from '@ovh-ux/manager-netapp';
import ovhManagerServerSidebar from '@ovh-ux/manager-server-sidebar';
import ovhManagerSupport from '@ovh-ux/manager-support';
import ovhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ovhManagerIncidentBanner from '@ovh-ux/manager-incident-banner';
import uiRouter, { RejectType } from '@uirouter/angularjs';
import chartjs from 'angular-chart.js';

import moduleExchange from '@ovh-ux/manager-exchange';
import ovhManagerFilters from '@ovh-ux/manager-filters';
import ovhManagerMetrics from '@ovh-ux/manager-metrics';
import ovhManagerCda from '@ovh-ux/manager-cda';
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
import cdn from './cdn';
import moduleLicense from './license';
import config, { getConstants } from './config/config';
import dedicatedCloud from './dedicatedCloud';
import dedicatedUniverseComponents from './dedicatedUniverseComponents';
import managedBaremetal from './managedBaremetal';
import errorPage from './error';
import expiredPage from './expired';
import ip from './ip';
import ipComponents from './components/ip/ip-components.module';

import dedicatedServer from './dedicated/server';
import dedicatedNas from './dedicated/nas';
import dedicatedHousing from './dedicated/housing';
import userContracts from './user-contracts';
import otrs from './otrs';

import { TRACKING } from './at-internet.constants';

export default (containerEl, environment) => {
  const configConstants = getConstants(environment.getRegion());

  const moduleName = 'App';

  angular
    .module(
      moduleName,
      [
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
        account,
        ovhManagerAccountSidebar,
        registerCoreModule(environment),
        ovhManagerAtInternetConfiguration,
        ovhManagerBilling,
        ovhManagerCookiePolicy,
        chartjs,
        'controllers',
        cdn,
        dedicatedCloud,
        dedicatedHousing,
        dedicatedNas,
        dedicatedServer,
        dedicatedUniverseComponents,
        'directives',
        errorPage,
        expiredPage,
        'filters',
        'internationalPhoneNumber',
        ip,
        ipComponents,
        'Module.download',
        environment.getRegion() === 'CA' ? moduleExchange : undefined,
        managedBaremetal,
        moduleLicense,
        otrs,
        ovhManagerMfaEnrollment,
        'ngMessages',
        ngAtInternet,
        ngAtInternetUiRouterPlugin,
        ngOvhApiWrappers,
        ngOvhBrowserAlert,
        ngOvhFeatureFlipping,
        ngOvhHttp,
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
        'ovh-api-services',
        ovhManagerAccountMigration,
        ovhManagerDbaasLogs,
        ovhManagerIncidentBanner,
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
        ovhManagerMetrics,
        ovhManagerNasha,
        ovhManagerNavbar,
        ovhManagerNetapp,
        ovhManagerVps,
        ovhManagerVrack,
        ovhManagerCloudConnect,
        ovhPaymentMethod,
        'pascalprecht.translate',
        'services',
        trustedNic,
        'ui.bootstrap',
        'ui.router',
        'ui.select',
        'ui.utils',
        'ui.validate',
        uiRouter,
        userContracts,
        'xeditable',
        ovhManagerCda,
      ].filter(isString),
    )
    .constant('constants', {
      prodMode: config.prodMode,
      swsProxyRootPath: config.swsProxyRootPath,
      aapiRootPath: config.aapiRootPath,
      target: config.target,
      renew: configConstants.RENEW_URL,
      urls: configConstants.URLS,
      UNIVERS: configConstants.UNIVERS,
      TOP_GUIDES: configConstants.TOP_GUIDES,
      vmsUrl: configConstants.vmsUrl,
      travauxUrl: configConstants.travauxUrl,
      aapiHeaderName: 'X-Ovh-Session',
      vrackUrl: configConstants.vrackUrl,
      REDIRECT_URLS: configConstants.REDIRECT_URLS,
      DEFAULT_LANGUAGE: configConstants.DEFAULT_LANGUAGE,
      FALLBACK_LANGUAGE: configConstants.FALLBACK_LANGUAGE,
      SUPPORT: configConstants.SUPPORT,
      SECTIONS_UNIVERSE_MAP: configConstants.SECTIONS_UNIVERSE_MAP,
    })
    .constant('website_url', configConstants.website_url)
    .config(
      /* @ngInject */ ($compileProvider, $logProvider) => {
        $compileProvider.debugInfoEnabled(!config.prodMode);
        $logProvider.debugEnabled(!config.prodMode);
      },
    )
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
    .config(
      /* @ngInject */ (ovhPaymentMethodProvider) => {
        ovhPaymentMethodProvider.setUserLocale(environment.getUserLocale());
      },
    )
    .constant('REGEX', {
      ROUTABLE_BLOCK: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(\d|[1-2]\d|3[0-2]))$/,
      ROUTABLE_IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      ROUTABLE_BLOCK_OR_IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(\d|[1-2]\d|3[0-2]))?$/,
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
            'app.dedicatedCloud',
            'veeam-enterprise',
          ];
          const IGNORE_STATES = [
            'app.configuration',
            'app.expired',
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
            error.handled = true;
            $rootScope.$emit('ovh::sidebar::hide');
            $state.go('app.error', { error });
          }
        });

        $state.defaultErrorHandler((error) => {
          if (error.type === RejectType.ERROR && !error.handled) {
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
        const lang = environment.getUserLanguage();
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
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    )
    .config(
      /* @ngInject */ (ovhFeatureFlippingProvider) => {
        ovhFeatureFlippingProvider.setApplicationName(
          environment.getApplicationName(),
        );
      },
    );

  import('./app.bundle').then(() => {
    angular.bootstrap(containerEl, [moduleName], {
      strictDi: false,
    });
  });

  return moduleName;
};
