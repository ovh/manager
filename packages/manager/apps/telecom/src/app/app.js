import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';
import set from 'lodash/set';
import { Environment } from '@ovh-ux/manager-config';
import ovhManagerBetaPreference from '@ovh-ux/manager-beta-preference';
import ovhManagerAccountSidebar from '@ovh-ux/manager-account-sidebar';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerDashboard from '@ovh-ux/manager-telecom-dashboard';
import ovhManagerFreefax from '@ovh-ux/manager-freefax';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';
import ovhManagerOverTheBox from '@ovh-ux/manager-overthebox';
import ovhManagerSms from '@ovh-ux/manager-sms';
import ovhManagerTelecomTask from '@ovh-ux/manager-telecom-task';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
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
import ovhNotificationsSidebar from '@ovh-ux/manager-notifications-sidebar';

import uiRouter, { RejectType } from '@uirouter/angularjs';
import TelecomAppCtrl from './app.controller';
import pack from './telecom/pack';
import telephony from './telecom/telephony';

import errorPage from './error-page/error-page.module';
import searchPage from './search/search.module';
import navbar from '../components/navbar';

import portabilities from './telecom/telephony/alias/portability/portabilities/telecom-telephony-alias-portability-portabilities.module';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import './app-scss.scss';
import './app.less';

Environment.setVersion(__VERSION__);

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
      'ngPassword',
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
      ngOvhUiRouterLayout,
      ngOvhUiRouterLineProgress,
      ngOvhUiRouterTitle,
      ngOvhContact,
      ngOvhLineDiagnostics,
      ngQAllSettled,
      'ovh-angular-responsive-tabs',
      ngOvhSidebarMenu,
      ngOvhSimpleCountryList,
      ngOvhTimeline,
      ngOvhUiConfirmModal,
      'ovh-api-services',
      'ovh-ng-input-password',
      ovhManagerAccountSidebar,
      ovhManagerBetaPreference,
      ovhManagerCore,
      ovhManagerDashboard,
      ovhManagerFreefax,
      ovhManagerNavbar,
      ovhManagerOverTheBox,
      ovhManagerSms,
      ovhManagerTelecomTask,
      ovhNotificationsSidebar,
      'oui',
      'pascalprecht.translate',
      'smoothScroll',
      errorPage,
      navbar,
      'tmh.dynamicLocale',
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
      portabilities,
      searchPage,
      ngOvhFeatureFlipping,
      ...get(__NG_APP_INJECTIONS__, Environment.getRegion(), []),
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
    ovhFeatureFlippingProvider.setApplicationName('telecom');
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

  /*= =========  PAGE TRACKING  ========== */
  .config(
    (atInternetProvider, atInternetUiRouterPluginProvider, telecomConfig) => {
      const trackingEnabled = telecomConfig.env === 'prod';
      atInternetProvider.setEnabled(trackingEnabled);
      atInternetProvider.setDebug(!trackingEnabled);
      atInternetUiRouterPluginProvider.setTrackStateChange(trackingEnabled);
      atInternetUiRouterPluginProvider.addStateNameFilter((routeName) =>
        routeName ? routeName.replace(/\./g, '::') : '',
      );
    },
  )
  .run((atInternet, TRACKING, OvhApiMe) => {
    const config = TRACKING.atInternetConfiguration;

    atInternet.setDefaultsPromise(
      OvhApiMe.v6()
        .get()
        .$promise.then((me) => {
          config.nichandle = me.nichandle;
          config.countryCode = me.country;
          config.currencyCode = me.currency && me.currency.code;
          config.visitorId = me.customerCode;
          return config;
        }),
    );
  })

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
    ssoAuthentication.login().then(() => {
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
        unregisterHook();
      });
    },
  );

export default moduleName;
