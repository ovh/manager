import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';

import tucSectionBackLink from './section-back-link.component';

const moduleName = 'tucSectionBackLink';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', translate, uiRouter])
  .component('tucSectionBackLink', tucSectionBackLink)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
