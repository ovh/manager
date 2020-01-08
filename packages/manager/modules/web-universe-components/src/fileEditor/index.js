import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';
import 'angular-xeditable';

import wucFileEditorDirective from './file-editor.directive';

import './file-editor.less';

const moduleName = 'wucFileEditor';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', translate, 'xeditable'])
  .directive('wucFileEditor', wucFileEditorDirective)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
