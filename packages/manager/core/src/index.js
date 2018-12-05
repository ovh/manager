import angular from 'angular';
import 'angular-translate';
import translateAsyncLoader from '@ovh-ux/translate-async-loader';

import 'ng-at-internet';
import 'ovh-api-services';

import translateLoaderPluggable from 'angular-translate-loader-pluggable';
import translateServiceProvider from './translate/translate.service';

import sessionService from './session/session.service';

import {
  LANGUAGES, REDIRECT_URLS, URLS,
} from './manager-core.constants';

const moduleName = 'ovhManagerCore';

angular
  .module(moduleName, [
    'ovh-api-services',
    'pascalprecht.translate',
    translateLoaderPluggable.name,
    'ng-at-internet',
    translateAsyncLoader,
  ])
  .constant('constants', {})
  .constant('CORE_LANGUAGES', LANGUAGES)

  .constant('CORE_REDIRECT_URLS', REDIRECT_URLS)
  // TODO : remove TARGET constant
  // We have to deliver a SPA without any reference to the TARGET, should be managed by the API
  .constant('TARGET', 'EU')
  .constant('CORE_URLS', URLS)
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
  .service('SessionService', sessionService);

export default moduleName;
