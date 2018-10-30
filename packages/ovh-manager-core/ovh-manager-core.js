import angular from 'angular';
import translate from 'angular-translate';
import translateAsyncLoader from '@ovh-ux/translate-async-loader';

import 'ng-at-internet';
import 'ovh-api-services';

import translateLoaderPluggable from 'angular-translate-loader-pluggable';
import translateServiceProvider from './translate/translate.service';

import sessionService from './session/session.service';

import {
  MANAGER_URLS, LANGUAGES, REDIRECT_URLS, URLS,
} from './ovh-manager-core.constants';

export default angular
  .module('ovhManagerCore', [
    'ovh-api-services',
    translate,
    translateLoaderPluggable.name,
    'ng-at-internet',
    translateAsyncLoader,
  ])
  .constant('constants', {})
  .constant('LANGUAGES', LANGUAGES)
  .constant('MANAGER_URLS', MANAGER_URLS)
  .constant('REDIRECT_URLS', REDIRECT_URLS)
  // TODO : remove TARGET constant
  // We have to deliver a SPA without any reference to the TARGET, should be managed by the API
  .constant('TARGET', 'EU')
  .constant('URLS', URLS)
  .provider('TranslateService', translateServiceProvider)
  .config(($translateProvider, translatePluggableLoaderProvider, TranslateServiceProvider) => {
    TranslateServiceProvider.setUserLocale();

    const defaultLanguage = TranslateServiceProvider.getUserLocale();

    $translateProvider.useLoader('translatePluggableLoader');

    translatePluggableLoaderProvider.useLoader('asyncLoader');

    $translateProvider.preferredLanguage(defaultLanguage);
    $translateProvider.use(defaultLanguage);
    $translateProvider.fallbackLanguage(LANGUAGES.fallback);
  })
  .service('SessionService', sessionService)
  .name;
