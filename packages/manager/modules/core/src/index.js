import { Environment, LANGUAGES } from '@ovh-ux/manager-config';

import angular from 'angular';
import { set, kebabCase } from 'lodash-es';

import 'angular-aria';
import 'angular-sanitize';
import 'angular-resource';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ovhOuiAngularTranslations from './translate/ovh-ui-angular';

import 'angular-dynamic-locale';
import 'angular-translate';
import 'angular-translate-loader-pluggable';

import '@ovh-ux/ng-ovh-request-tagger';

import '@uirouter/angularjs';

import coreConfig from './config';
import ouiConfig from './oui-angular';
import translateFactory from './translate/translate.factory';
import sessionService from './session/session.service';
import redirectionFilter from './redirection/redirection.filter';
import redirectionService from './redirection/redirection.service';

import {
  HOSTNAME_REGIONS,
  MANAGER_URLS,
  REDIRECT_URLS,
  URLS,
} from './manager-core.constants';

const moduleName = 'ovhManagerCore';

angular
  .module(moduleName, [
    'ngSanitize',
    'angular-translate-loader-pluggable',
    'ngOvhRequestTagger',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    coreConfig,
    ngTranslateAsyncLoader,
    ouiConfig,
    ovhOuiAngularTranslations,
    ngOvhHttp,
    ngOvhSsoAuth,
  ])
  .constant('constants', {})
  .provider(
    'CORE_MANAGER_URLS',
    /* @ngInject */ (coreConfigProvider) => ({
      URLS: MANAGER_URLS[coreConfigProvider.getRegion()],
      $get: () => MANAGER_URLS[coreConfigProvider.getRegion()],
    }),
  )
  .constant('CORE_REDIRECT_URLS', REDIRECT_URLS)
  .constant('CORE_URLS', URLS)
  .factory('TranslateInterceptor', translateFactory)
  .config(($translateProvider, translatePluggableLoaderProvider) => {
    const defaultLanguage = Environment.getUserLocale();

    $translateProvider.useLoader('translatePluggableLoader');

    translatePluggableLoaderProvider.useLoader('asyncLoader');

    $translateProvider.useLoaderCache(true);
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.useMissingTranslationHandler(
      'translateMissingTranslationHandler',
    );

    $translateProvider.preferredLanguage(defaultLanguage);

    $translateProvider.use(defaultLanguage);
    $translateProvider.fallbackLanguage(LANGUAGES.fallback);
  })
  .service('SessionService', sessionService)
  .service('RedirectionService', redirectionService)
  .filter('redirection', redirectionFilter)
  // Fix security issue: https://github.com/angular-translate/angular-translate/issues/1418
  .factory(
    'translateMissingTranslationHandler',
    ($sanitize) => (translationId) => $sanitize(translationId),
  )
  .run((tmhDynamicLocaleCache, tmhDynamicLocale) => {
    const injectAngularLocale = (lang) =>
      tmhDynamicLocaleCache.put(
        lang,
        angular.injector(['ngLocale']).get('$locale'),
      );
    const defaultLanguage = Environment.getUserLocale();
    const angularLocale = kebabCase(defaultLanguage);

    let angularLocalePromise;
    switch (angularLocale) {
      case 'de-de':
        angularLocalePromise = import('angular-i18n/angular-locale_de-de.js');
        break;
      case 'en-gb':
        angularLocalePromise = import('angular-i18n/angular-locale_en-gb.js');
        break;
      case 'en-us':
        angularLocalePromise = import('angular-i18n/angular-locale_en-us.js');
        break;
      case 'es-es':
        angularLocalePromise = import('angular-i18n/angular-locale_es-es.js');
        break;
      case 'fi-fi':
        angularLocalePromise = import('angular-i18n/angular-locale_fi-fi.js');
        break;
      case 'fr-ca':
        angularLocalePromise = import('angular-i18n/angular-locale_fr-ca.js');
        break;
      case 'it-it':
        angularLocalePromise = import('angular-i18n/angular-locale_it-it.js');
        break;
      case 'lt-lt':
        angularLocalePromise = import('angular-i18n/angular-locale_lt-lt.js');
        break;
      case 'pl-pl':
        angularLocalePromise = import('angular-i18n/angular-locale_pl-pl.js');
        break;
      case 'pt-pt':
        angularLocalePromise = import('angular-i18n/angular-locale_pt-pt.js');
        break;
      case 'fr-fr':
      default:
        angularLocalePromise = import('angular-i18n/angular-locale_fr-fr.js');
        break;
    }

    angularLocalePromise
      .then(() => injectAngularLocale(angularLocale))
      .then(() => tmhDynamicLocale.set(angularLocale));
  })
  .run(
    /* @ngInject */ ($rootScope) => {
      $rootScope.$on('lang.onChange', (event, { lang }) => {
        Environment.setUserLocale(lang);
        window.location.reload();
      });
    },
  )
  .run(
    /* @ngInject */ ($document) => {
      $document
        .querySelectorAll('html')[0]
        .setAttribute('lang', Environment.getUserLanguage());
    },
  )
  .run((ssoAuthentication /* , User */) => {
    ssoAuthentication.login(); // .then(() => User.getUser());
  })
  .constant('OVH_SSO_AUTH_LOGIN_URL', '/auth')
  .factory('serviceTypeInterceptor', () => ({
    request(config) {
      const localConfig = config;
      if (/^(\/?engine\/)?2api(-m)?\//.test(localConfig.url)) {
        localConfig.url = localConfig.url.replace(
          /^(\/?engine\/)?2api(-m)?/,
          '',
        );
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
  .config(
    (ssoAuthenticationProvider, $httpProvider, OVH_SSO_AUTH_LOGIN_URL) => {
      ssoAuthenticationProvider.setLoginUrl(OVH_SSO_AUTH_LOGIN_URL);
      ssoAuthenticationProvider.setLogoutUrl(
        `${OVH_SSO_AUTH_LOGIN_URL}?action=disconnect`,
      );
      ssoAuthenticationProvider.setSignUpUrl(
        `${OVH_SSO_AUTH_LOGIN_URL}/signup/new/`,
      );

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
        {
          serviceType: 'ws',
          urlPrefix: '/engine/ws',
        },
        {
          serviceType: 'none',
          urlPrefix: '',
        },
      ]);

      $httpProvider.interceptors.push('serviceTypeInterceptor');
      $httpProvider.interceptors.push('OvhSsoAuthInterceptor');
      $httpProvider.interceptors.push('OvhNgRequestTaggerInterceptor');
    },
  )
  .config(
    /* @ngInject */ ($httpProvider) => {
      $httpProvider.interceptors.push('TranslateInterceptor');
    },
  )
  .config((OvhHttpProvider) => {
    // OvhHttpProvider.rootPath = constants.swsProxyPath;
    set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
    set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
    set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
  })
  .config(
    /* @ngInject */ ($urlServiceProvider) => {
      $urlServiceProvider.config.strictMode(false);
    },
  )
  .run(
    /* @ngInject */ (OvhNgRequestTaggerInterceptor) => {
      OvhNgRequestTaggerInterceptor.setHeaderVersion(Environment.getVersion());
    },
  );

export default moduleName;

export const bootstrapApplication = () => {
  return fetch('/engine/2api/configuration', {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.assign(
          `/auth?action=disconnect&onsuccess=${encodeURIComponent(
            window.location.href,
          )}`,
        );
      }
      return response.json();
    })
    .catch(() => ({
      region: HOSTNAME_REGIONS[window.location.hostname],
    }))
    .then((configuration) => {
      Environment.setRegion(configuration.region);
      return {
        ...configuration,
        locale: Environment.getUserLocale(),
      };
    });
};
