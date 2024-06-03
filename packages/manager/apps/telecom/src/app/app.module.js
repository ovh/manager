/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-ui-bootstrap';
import 'angular-ui-validate';
import 'angular-cookies';
import 'script-loader!angular-dynamic-locale/dist/tmhDynamicLocale.min.js';
import 'angular-flash-alert';
import 'angular-inview';
import 'angular-messages';
import 'angular-resource';
import 'angular-sanitize';
import 'angular-translate';
import 'angular-translate-loader-partial';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';
import 'script-loader!moment/min/moment.min.js';
import 'script-loader!fullcalendar/dist/fullcalendar.js';
import 'angular-ui-calendar';
import 'script-loader!ui-select/dist/select.js';
import 'script-loader!jquery-ui/ui/version.js';
import 'script-loader!jquery-ui/ui/plugin.js';
import 'script-loader!jquery-ui/ui/widget.js';
import 'script-loader!jquery-ui/ui/data.js';
import 'script-loader!jquery-ui/ui/scroll-parent.js';
import 'script-loader!jquery-ui/ui/safe-active-element.js';
import 'script-loader!jquery-ui/ui/safe-blur.js';
import 'script-loader!jquery-ui/ui/widgets/mouse.js';
import 'script-loader!jquery-ui/ui/widgets/sortable.js';
import 'script-loader!jquery-ui/ui/widgets/draggable.js';
import 'angular-ui-sortable';
import 'script-loader!angular-ui-utils/ui-utils.js';
import 'angular-validation-match';
import 'bootstrap';
import 'script-loader!CSV-JS/csv.js';
import 'matchmedia-polyfill';
import 'matchmedia-ng';
import 'script-loader!messenger/build/js/messenger.js';
import 'script-loader!messenger/build/js/messenger-theme-future.js';
import 'script-loader!messenger/build/js/messenger-theme-flat.js';
import 'ng-csv';
import 'script-loader!ngSmoothScroll/angular-smooth-scroll.js';
import 'script-loader!international-phone-number/releases/international-phone-number.js';
import 'ovh-api-services';
import 'script-loader!jquery.scrollto';
import '@ovh-ux/ng-ovh-contracts';
import 'script-loader!urijs/src/URI.min.js';
import 'script-loader!urijs/src/URITemplate.js';
import 'script-loader!leaflet/dist/leaflet-src.js';
import 'angular-leaflet-directive';
import 'ng-slide-down';
import 'script-loader!angularjs-scroll-glue/src/scrollglue.js';
import 'ovh-ng-input-password';
import '@ovh-ux/ui-kit';
import 'angular-translate-loader-pluggable';
import '@ovh-ux/manager-telecom-styles';
import '@ovh-ux/ng-ovh-actions-menu';
/* eslint-enable */

import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';
import set from 'lodash/set';
import * as dateFnsLocales from 'date-fns/locale';
import * as d3 from 'd3';

import ovhManagerBetaPreference from '@ovh-ux/manager-beta-preference';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ovhManagerDashboard from '@ovh-ux/manager-telecom-dashboard';
import ovhManagerFreefax from '@ovh-ux/manager-freefax';
import ovhManagerOverTheBox from '@ovh-ux/manager-overthebox';
import ovhManagerSms from '@ovh-ux/manager-sms';
import ovhManagerTelecomTask from '@ovh-ux/manager-telecom-task';
import '@ovh-ux/ng-at-internet';
import { registerAtInternet } from '@ovh-ux/ng-shell-tracking';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import ngOvhCheckboxTable from '@ovh-ux/ng-ovh-checkbox-table';
import ngOvhUiConfirmModal from '@ovh-ux/ng-ovh-ui-confirm-modal';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhBrowserAlert from '@ovh-ux/ng-ovh-browser-alert';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhMondialRelay from '@ovh-ux/ng-ovh-mondial-relay';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import ngOvhUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ngOvhUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ngOvhUiRouterTitle from '@ovh-ux/ng-ui-router-title';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import ngQAllSettled from '@ovh-ux/ng-q-allsettled';
import ngTailLogs from '@ovh-ux/ng-tail-logs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhSimpleCountryList from '@ovh-ux/ng-ovh-simple-country-list';
import ngOvhLineDiagnostics from '@ovh-ux/ng-ovh-line-diagnostics';
import ngOvhContact from '@ovh-ux/ng-ovh-contact';
import ngOvhTimeline from '@ovh-ux/ng-ovh-timeline';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';

import uiRouter, { RejectType } from '@uirouter/angularjs';
import TelecomAppCtrl from './app.controller';
import pack from './telecom/pack';
import telephony from './telecom/telephony';
import telephonyComponents from '../components/telecom/telephony';
import popoverUtils from '../components/popover';
import uibDropdownUtils from '../components/uib-dropdown-helper';

import errorPage from './error-page/error-page.module';
import searchPage from './search/search.module';
import navbar from '../components/navbar';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import './app-scss.scss';
import './app.less';

import { TRACKING } from './at-internet.constants';

window.d3 = d3;

const getEnvironment = (shellClient) => {
  return shellClient.environment.getEnvironment();
};

const getLocale = (shellClient) => {
  return shellClient.i18n.getLocale();
};

export default async (containerEl, shellClient) => {
  const moduleName = 'managerApp';

  const [environment, locale] = await Promise.all([
    getEnvironment(shellClient),
    getLocale(shellClient),
  ]);

  const coreCallbacks = {
    onLocaleChange: (lang) => {
      shellClient.i18n.setLocale(lang);
    },
  };

  const getDateFnsLocale = (language) => {
    if (language === 'en_GB') {
      return 'enGB';
    }
    if (language === 'fr_CA') {
      return 'frCA';
    }
    const [loc] = language.split('_');
    return loc;
  };

  angular
    .module(
      moduleName,
      [
        'angular-inview',
        'angular-translate-loader-pluggable',
        'matchmedia-ng',
        'ngAnimate',
        'ngAria',
        registerAtInternet(shellClient.tracking),
        ngAtInternetUiRouterPlugin,
        ovhManagerAtInternetConfiguration,
        'ngCookies',
        'ngCsv',
        'ngFlash',
        'ngMessages',
        'ngOvhContracts',
        'ngResource',
        'ngSanitize',
        'ngOvhActionsMenu',
        ngOvhCheckboxTable,
        ngOvhApiWrappers,
        ngOvhBrowserAlert,
        ngOvhChart,
        ngOvhHttp,
        ngOvhMondialRelay,
        ngOvhSsoAuth,
        ngOvhSwimmingPoll,
        ngOvhTelecomUniverseComponents,
        ngPaginationFront,
        ngTailLogs,
        ngTranslateAsyncLoader,
        ngOvhPaymentMethod,
        ngOvhUiRouterBreadcrumb,
        ngOvhUiRouterLayout,
        ngOvhUiRouterTitle,
        ngOvhContact,
        ngOvhLineDiagnostics,
        ngQAllSettled,
        ngOvhSimpleCountryList,
        ngOvhTimeline,
        ngOvhUiConfirmModal,
        'ovh-api-services',
        'ovh-ng-input-password',
        ovhManagerBetaPreference,
        registerCoreModule(environment, coreCallbacks),
        ovhManagerDashboard,
        ovhManagerFreefax,
        ovhManagerOverTheBox,
        ovhManagerSms,
        ovhManagerTelecomTask,
        'oui',
        'pascalprecht.translate',
        popoverUtils,
        'smoothScroll',
        errorPage,
        navbar,
        'tmh.dynamicLocale',
        uibDropdownUtils,
        'ui.bootstrap',
        'ui.select',
        uiRouter,
        'ui.utils',
        'ui.calendar',
        'ui.sortable',
        'ui.validate',
        'validation.match',
        pack,
        telephony,
        telephonyComponents,
        searchPage,
        ngOvhFeatureFlipping,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )

    /*= =========  GLOBAL OPTIONS  ========== */
    .config(
      (
        $urlRouterProvider,
        $locationProvider,
        $compileProvider,
        $logProvider,
        telecomConfig,
      ) => {
        $urlRouterProvider.otherwise('/');

        // $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('');

        $compileProvider.debugInfoEnabled(telecomConfig.env !== 'prod');
        $logProvider.debugEnabled(telecomConfig.env !== 'prod');
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
    .config((LineDiagnosticsProvider) => {
      LineDiagnosticsProvider.setPathPrefix('/xdsl/{serviceName}');
    })
    .config((ovhFeatureFlippingProvider) => {
      ovhFeatureFlippingProvider.setApplicationName(
        environment.getApplicationName(),
      );
    })
    .config(
      /* @ngInject */ (ovhPaymentMethodProvider) => {
        ovhPaymentMethodProvider.setUserLocale(locale);
      },
    )
    .constant('DATEFNS_LOCALE', dateFnsLocales[getDateFnsLocale(locale)])
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
    .config(async () => {
      await shellClient.tracking.setConfig(environment.getRegion(), TRACKING);
    })
    .provider('shellClient', {
      $get() {
        return shellClient;
      },
    })
    .config(
      /* @ngInject */ (atInternetConfigurationProvider) => {
        atInternetConfigurationProvider.setSkipInit(true);
      },
    )
    /*= =========  INTERCEPT ERROR IF NO TRANSLATION FOUND  ========== */
    .factory('translateInterceptor', ($q) => {
      const regexp = new RegExp(/Messages\w+\.json$/i);
      return {
        responseError(rejection) {
          if (regexp.test(rejection.config.url)) {
            return {};
          }
          return $q.reject(rejection);
        },
      };
    })

    /*= =========  LOAD TRANSLATIONS  ========== */
    .config(($transitionsProvider, $httpProvider) => {
      $httpProvider.interceptors.push('translateInterceptor');

      $transitionsProvider.onBefore({}, (transition) => {
        transition.addResolvable({
          token: 'translations',
          deps: [],
          resolveFn: () => null,
        }); // transition.addResolvable
      }); // $transitionsProvider.onBefore
    })

    /*= =========  CHECK IF STILL LOGGED IN  ========== */
    .run((ssoAuthentication, $transitions) => {
      $transitions.onStart({}, (transition) => {
        const next = transition.to();
        let authenticate;

        if (next.authenticate !== undefined) {
          authenticate = next.authenticate;
        } else {
          authenticate = true;
        }

        if (authenticate) {
          ssoAuthentication.sessionCheckOrGoLogin();
        }
      });
    })

    /*= =========  LOAD NAVBAR AND SIDEBAR  ========== */
    .run(
      /* @ngInject */ ($rootScope, $timeout, TelecomNavbar) => {
        TelecomNavbar.getResponsiveLinks()
          .then((links) => set($rootScope, 'navbar.sidebarLinks', links))
          .finally(() => {
            $timeout(() => $rootScope.$broadcast('sidebar:loaded'));
          });
      },
    )

    .config(($logProvider) => {
      $logProvider.debugEnabled(false);
    })

    .run(
      /* @ngInject */ ($translatePartialLoader) => {
        $translatePartialLoader.addPart('common');
        $translatePartialLoader.addPart('components');
      },
    )
    .controller('TelecomAppCtrl', TelecomAppCtrl)
    .run(/* @ngTranslationsInject:json ./translations */)
    .run(
      /* @ngInject */ ($rootScope, $state, $transitions) => {
        $transitions.onError({}, (transition) => {
          const error = transition.error();
          if (error.type === RejectType.ERROR) {
            $rootScope.$emit('ovh::sidebar::hide');
            $state.go(
              'telecomError',
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
          return error;
        });
      },
    )
    .run(/* @ngTranslationsInject:json ./common/translations */)
    .run(
      /* @ngInject */ ($transitions) => {
        // replace ngOvhUiRouterLineProgress if in container
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
      /* @ngInject */ ($rootScope, $transitions) => {
        const unregisterHook = $transitions.onSuccess({}, () => {
          if (!isTopLevelApplication()) {
            shellClient.ux.hidePreloader();
          }
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    );

  import('./app.bundle').then(() =>
    angular.bootstrap(containerEl, [moduleName], {
      strictDi: false,
    }),
  );

  return moduleName;
};
