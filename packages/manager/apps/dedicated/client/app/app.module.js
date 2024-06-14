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
import 'script-loader!matchmedia-ng/matchmedia-ng.js';
import 'angular-aria';
import 'script-loader!messenger/build/js/messenger.min.js';
import 'script-loader!filesize/lib/filesize.js';
import 'script-loader!angular-websocket/dist/angular-websocket';

import './app.less';
import './css/source.scss';
/* eslint-enable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import isString from 'lodash/isString';
import trustedNic from '@ovh-ux/manager-trusted-nic';
import '@ovh-ux/ng-at-internet';
import { registerAtInternet } from '@ovh-ux/ng-shell-tracking';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhBrowserAlert from '@ovh-ux/ng-ovh-browser-alert';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngOvhExportCsv from '@ovh-ux/ng-ovh-export-csv';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhProxyRequest from '@ovh-ux/ng-ovh-proxy-request';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';
import ngOvhUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import ngQAllSettled from '@ovh-ux/ng-q-allsettled';
import ngTailLogs from '@ovh-ux/ng-tail-logs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ovhContacts from '@ovh-ux/ng-ovh-contacts';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';
import { registerCoreModule } from '@ovh-ux/manager-core';
import { serverBandwidth } from '@ovh-ux/manager-components';
import ovhManagerBanner from '@ovh-ux/manager-banner';
import ovhManagerBilling from '@ovh-ux/manager-billing';
import ovhManagerDbaasLogs from '@ovh-ux/manager-dbaas-logs';
import ovhManagerNasha from '@ovh-ux/manager-nasha';
import ovhManagerNetapp from '@ovh-ux/manager-netapp';
import ovhManagerSupport from '@ovh-ux/manager-support';
import ovhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import uiRouter, { RejectType } from '@uirouter/angularjs';

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
import ovhManagerAccountMigration from '@ovh-ux/manager-account-migration';
import ovhManagerNutanix from '@ovh-ux/manager-nutanix';
import { pollingService } from '@ovh-ux/manager-bm-server-components';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
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

import dedicatedServer from './dedicated/dedicated-server';
import dedicatedHousing from './dedicated/housing';
import userContracts from './user-contracts';
import otrs from './otrs';

import networkSecurity from './network-security';

import { TRACKING } from './at-internet.constants';

const getEnvironment = (shellClient) => {
  return shellClient.environment.getEnvironment();
};

const getLocale = (shellClient) => {
  return shellClient.i18n.getLocale();
};

export default async (containerEl, shellClient) => {
  const moduleName = 'App';

  const [environment, locale] = await Promise.all([
    getEnvironment(shellClient),
    getLocale(shellClient),
  ]);

  const coreCallbacks = {
    onLocaleChange: (lang) => {
      shellClient.i18n.setLocale(lang);
    },
  };

  const configConstants = getConstants(environment.getRegion());

  angular
    .module(
      moduleName,
      [
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
        account,
        registerCoreModule(environment, coreCallbacks),
        registerAtInternet(shellClient.tracking),
        ovhManagerAtInternetConfiguration,
        ovhManagerBilling,
        'controllers',
        cdn,
        dedicatedCloud,
        dedicatedHousing,
        dedicatedServer,
        dedicatedUniverseComponents,
        serverBandwidth,
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
        'ngMessages',
        ngAtInternetUiRouterPlugin,
        ngOvhApiWrappers,
        ngOvhBrowserAlert,
        ngOvhChart,
        ngOvhCloudUniverseComponents,
        ngOvhFeatureFlipping,
        ngOvhHttp,
        ngOvhProxyRequest,
        ngOvhSsoAuth,
        ngOvhSwimmingPoll,
        ngOvhUiRouterLayout,
        ngOvhUserPref,
        ngOvhUtils,
        ngOvhWebUniverseComponents,
        'ngRoute',
        'ngSanitize',
        ngTranslateAsyncLoader,
        'oui',
        ngOvhExportCsv,
        ngPaginationFront,
        ngQAllSettled,
        'ovh-api-services',
        ovhManagerAccountMigration,
        ovhManagerDbaasLogs,
        ovhManagerIplb,
        ovhManagerSupport,
        ovhManagerVeeamEnterprise,
        ovhManagerVeeamCloudConnect,
        ovhManagerNutanix,
        ovhManagerFilters,
        ngTailLogs,
        ovhContacts,
        ovhManagerBanner,
        ovhManagerMetrics,
        ovhManagerNasha,
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
        networkSecurity,
      ].filter(isString),
    )
    .service('Polling', pollingService)
    .constant('shellClient', shellClient)
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
      statusUrl: configConstants.statusUrl,
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
    .config(async () => {
      await shellClient.tracking.setConfig(environment.getRegion(), TRACKING);
    })
    .config(
      /* @ngInject */ (atInternetConfigurationProvider) => {
        atInternetConfigurationProvider.setSkipInit(true);
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
        ovhPaymentMethodProvider.setUserLocale(locale);
      },
    )
    .config(
      /* @ngInject */ (ssoAuthenticationProvider) => {
        ssoAuthenticationProvider.setOnLogin(() => {
          shellClient.auth.login();
        });
        ssoAuthenticationProvider.setOnLogout(() => {
          shellClient.auth.logout();
        });
      },
    )
    .constant('REGEX', {
      ROUTABLE_BLOCK: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(\d|[1-2]\d|3[0-2]))$/,
      ROUTABLE_IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      ROUTABLE_BLOCK_OR_IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(\d|[1-2]\d|3[0-2]))?$/,
    })
    .run(
      /* @ngInject */ ($transitions) => {
        if (!isTopLevelApplication()) {
          $transitions.onBefore({}, (transition) => {
            if (
              !transition.ignored() &&
              transition.from().name !== '' &&
              transition.entering().length > 0
            ) {
              shellClient.ux.startProgress();
            }
          });

          $transitions.onSuccess({}, () => {
            shellClient.ux.stopProgress();
          });

          $transitions.onError({}, (transition) => {
            if (!transition.error().redirected) {
              shellClient.ux.stopProgress();
            }
          });
        }
      },
    )
    .run(
      /* @ngInject */ ($rootScope, $state, $transitions, coreConfig) => {
        $rootScope.$on('$locationChangeStart', () => {
          // eslint-disable-next-line no-param-reassign
          delete $rootScope.isLeftMenuVisible;
        });

        $transitions.onBefore({}, (transition) => {
          const HPC_STATES = [
            'app.hpc',
            'app.dedicatedCloud',
            'veeam-enterprise',
            'nutanix',
          ];

          const ACCOUNT_STATES = ['app.account'];

          const IGNORE_STATES = [
            'app.configuration',
            'app.expired',
            'app.ip',
            'vrack',
            'cloud-connect',
            'error',
            'iplb',
            'network-security',
          ];

          const stateIncludes = Object.keys(transition.$to().includes);

          if (HPC_STATES.some((state) => stateIncludes.includes(state))) {
            $rootScope.$broadcast('switchUniverse', 'hpc');
          } else if (
            ACCOUNT_STATES.some((state) => stateIncludes.includes(state))
          ) {
            $rootScope.$broadcast('switchUniverse', null);
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
          if (error.type === RejectType.ERROR && !error.handled) {
            $rootScope.$emit('ovh::sidebar::hide');
            $state.go(
              'error',
              {
                detail: {
                  message: get(error.detail, 'data.message'),
                  status: error.detail?.status,
                  code: has(error.detail, 'headers')
                    ? error.detail.headers('x-ovh-queryId')
                    : null,
                },
                to: {
                  state: transition.to(),
                  params: transition.params(),
                },
              },
              { location: false },
            );
          }
        });

        $state.defaultErrorHandler((error) => {
          console.log(error);
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
        const [lang] = locale.split('_');
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
        $transitions.onStart({}, () => {
          $('#currentAction').modal('hide');
          $('.modal-backdrop').remove();
          $('.help4wizards').removeClass('open');
        });
        const unregisterHook = $transitions.onSuccess({}, async () => {
          if (!isTopLevelApplication()) {
            await shellClient.ux.hidePreloader();
          }
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
