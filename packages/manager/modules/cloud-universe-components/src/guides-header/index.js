import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import { CucGuidesService } from './guides-header.constants';

const moduleName = 'ovhManagerPciComponentsProjectGuidesHeader';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .service('CucGuidesService', CucGuidesService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
