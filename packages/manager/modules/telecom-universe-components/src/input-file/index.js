import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';

import tucInputFileChangeDirective from './input-file-change.directive';
import tucInputFileDirective from './input-file.directive';
import './input-file.less';

const moduleName = 'tucInputFile';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', translate])
  .directive('tucInputFileChange', tucInputFileChangeDirective)
  .directive('tucInputFile', tucInputFileDirective)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
