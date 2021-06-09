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
import 'script-loader!d3/build/d3.js';
import 'matchmedia-polyfill';
import 'matchmedia-ng';
import 'script-loader!messenger/build/js/messenger.js';
import 'script-loader!messenger/build/js/messenger-theme-future.js';
import 'script-loader!messenger/build/js/messenger-theme-flat.js';
import 'ng-csv';
import 'script-loader!ngSmoothScroll/angular-smooth-scroll.js';
import 'script-loader!intl-tel-input/build/js/intlTelInput.min.js';
import 'script-loader!intl-tel-input/lib/libphonenumber/build/utils.js';
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
/* eslint-enable */

import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';
import set from 'lodash/set';

import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';
import ovhManagerBetaPreference from '@ovh-ux/manager-beta-preference';
import ovhManagerAccountSidebar from '@ovh-ux/manager-account-sidebar';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ovhManagerCookiePolicy from '@ovh-ux/manager-cookie-policy';
import ovhManagerDashboard from '@ovh-ux/manager-telecom-dashboard';
import ovhManagerFreefax from '@ovh-ux/manager-freefax';
import ovhManagerIncidentBanner from '@ovh-ux/manager-incident-banner';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';
import ovhManagerOverTheBox from '@ovh-ux/manager-overthebox';
import ovhManagerSms from '@ovh-ux/manager-sms';
import ovhManagerTelecomTask from '@ovh-ux/manager-telecom-task';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ovhManagerAccountMigration from '@ovh-ux/manager-account-migration';
import ngOvhCheckboxTable from '@ovh-ux/ng-ovh-checkbox-table';
import ngOvhUiConfirmModal from '@ovh-ux/ng-ovh-ui-confirm-modal';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhBrowserAlert from '@ovh-ux/ng-ovh-browser-alert';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhMondialRelay from '@ovh-ux/ng-ovh-mondial-relay';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ngOvhSsoAuthModalPlugin from '@ovh-ux/ng-ovh-sso-auth-modal-plugin';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import ngOvhUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ngOvhUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngOvhUiRouterTitle from '@ovh-ux/ng-ui-router-title';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import ngQAllSettled from '@ovh-ux/ng-q-allsettled';
import ngTailLogs from '@ovh-ux/ng-tail-logs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhSidebarMenu from '@ovh-ux/ng-ovh-sidebar-menu';
import ngOvhSimpleCountryList from '@ovh-ux/ng-ovh-simple-country-list';
import ngOvhLineDiagnostics from '@ovh-ux/ng-ovh-line-diagnostics';
import ngOvhContact from '@ovh-ux/ng-ovh-contact';
import ngOvhTimeline from '@ovh-ux/ng-ovh-timeline';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ovhNotificationsSidebar from '@ovh-ux/manager-notifications-sidebar';

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

export default (containerEl, environment) => {
  const moduleName = 'managerApp';

  angular
    .module(
      moduleName,
      [
        'angular-inview',
        'angular-translate-loader-pluggable',
        'matchmedia-ng',
        'ngAnimate',
        'ngAria',
        ngAtInternet,
        ngAtInternetUiRouterPlugin,
        'ngCookies',
        'ngCsv',
        'ngFlash',
        'ngMessages',
        'ngOvhContracts',
        'ngResource',
        'ngSanitize',
        ngOvhCheckboxTable,
        ngOvhApiWrappers,
        ngOvhBrowserAlert,
        ngOvhHttp,
        ngOvhMondialRelay,
        ngOvhSsoAuth,
        ngOvhSsoAuthModalPlugin,
        ngOvhSwimmingPoll,
        ngOvhTelecomUniverseComponents,
        ngPaginationFront,
        ngTailLogs,
        ngTranslateAsyncLoader,
        ngOvhPaymentMethod,
        ngOvhUiRouterBreadcrumb,
        ngOvhUiRouterLayout,
        ngOvhUiRouterLineProgress,
        ngOvhUiRouterTitle,
        ngOvhContact,
        ngOvhLineDiagnostics,
        ngQAllSettled,
        ngOvhSidebarMenu,
        ngOvhSimpleCountryList,
        ngOvhTimeline,
        ngOvhUiConfirmModal,
        'ovh-api-services',
        'ovh-ng-input-password',
        ovhManagerAccountSidebar,
        ovhManagerAtInternetConfiguration,
        ovhManagerAccountMigration,
        ovhManagerBetaPreference,
        registerCoreModule(environment),
        ovhManagerCookiePolicy,
        ovhManagerDashboard,
        ovhManagerFreefax,
        ovhManagerIncidentBanner,
        ovhManagerNavbar,
        ovhManagerOverTheBox,
        ovhManagerSms,
        ovhManagerTelecomTask,
        ovhNotificationsSidebar,
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
        ovhPaymentMethodProvider.setUserLocale(environment.getUserLocale());
      },
    )
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
    .config(
      /* @ngInject */ (atInternetConfigurationProvider) => {
        atInternetConfigurationProvider.setConfig(TRACKING);
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
    .run(
      /* @ngInject */ ($rootScope, $state) => {
        $state.defaultErrorHandler((error) => {
          if (error.type === RejectType.ERROR) {
            $rootScope.$emit('ovh::sidebar::hide');
            $state.go(
              'telecomError',
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
      },
    )
    .run(/* @ngTranslationsInject:json ./common/translations */)
    .run(
      /* @ngInject */ ($rootScope, $transitions) => {
        const unregisterHook = $transitions.onSuccess({}, () => {
          detachPreloader();
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    )
    .run(
      /* @ngInject */ ($translate, $transitions) => {
        $transitions.onBefore({ to: 'telecom.**' }, () => $translate.refresh());
      },
    );

  import('./app.bundle').then(() =>
    angular.bootstrap(containerEl, [moduleName], {
      strictDi: false,
    }),
  );

  return moduleName;
};
