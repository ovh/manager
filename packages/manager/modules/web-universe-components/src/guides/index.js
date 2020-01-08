import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';

import wucGuidesDirective from './guides.directive';
import wucGUIDES from './guides.constant';

import './guides.less';

const moduleName = 'wucGuides';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'ovh-api-services', translate])
  .constant('WUC_GUIDES', wucGUIDES)
  .directive('wucGuides', wucGuidesDirective)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
