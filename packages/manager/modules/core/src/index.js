import { Environment } from '@ovh-ux/manager-config';

import angular from 'angular';
import set from 'lodash/set';

import 'angular-aria';
import 'angular-sanitize';
import 'angular-resource';

import kebabCase from 'lodash/kebabCase';
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
import translateFactory from './translate/translate.factory';
import translateServiceProvider from './translate/translate.service';
import sessionService from './session/session.service';
import redirectionFilter from './redirection/redirection.filter';
import redirectionService from './redirection/redirection.service';

import {
  LANGUAGES,
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
    ovhOuiAngularTranslations,
    ngOvhHttp,
    ngOvhSsoAuth,
  ])
  .constant('constants', {})
  .constant('CORE_LANGUAGES', LANGUAGES)
  .constant('CORE_MANAGER_URLS', MANAGER_URLS)
  .constant('CORE_REDIRECT_URLS', REDIRECT_URLS)
  .constant('CORE_URLS', URLS)
  .provider('TranslateService', translateServiceProvider)
  .factory('TranslateInterceptor', translateFactory)
  .config(
    (
      $translateProvider,
      translatePluggableLoaderProvider,
      TranslateServiceProvider,
    ) => {
      TranslateServiceProvider.setUserLocale();

      const defaultLanguage = TranslateServiceProvider.getUserLocale();

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
    },
  )
  .service('SessionService', sessionService)
  .service('RedirectionService', redirectionService)
  .filter('redirection', redirectionFilter)
  // Fix security issue: https://github.com/angular-translate/angular-translate/issues/1418
  .factory(
    'translateMissingTranslationHandler',
    ($sanitize) => (translationId) => $sanitize(translationId),
  )
  .run((tmhDynamicLocaleCache, tmhDynamicLocale, TranslateService) => {
    const injectAngularLocale = (lang) =>
      tmhDynamicLocaleCache.put(
        lang,
        angular.injector(['ngLocale']).get('$locale'),
      );
    const defaultLanguage = TranslateService.getUserLocale();
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
    /* @ngInject */ ($rootScope, TranslateService) => {
      $rootScope.$on('lang.onChange', (event, { lang }) => {
        TranslateService.setUserLocale(lang);
        window.location.reload();
      });
    },
  )
  .run(
    /* @ngInject */ ($document) => {
      let { 'univers-selected-language': lang } = localStorage;
      [lang] = lang.split('_');
      $document.querySelectorAll('html')[0].setAttribute('lang', lang);
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
        `${OVH_SSO_AUTH_LOGIN_URL}/signup/new`,
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
