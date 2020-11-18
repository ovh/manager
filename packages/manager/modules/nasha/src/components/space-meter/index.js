import angular from 'angular';
import 'angular-ui-bootstrap';
import '@ovh-ux/ng-translate-async-loader';

import legend from './legend';
import spaceLeft from './space-left';

import cucCloudSpaceMeter from './component';

import './index.less';

const moduleName = 'cucCloudSpaceMeter';

angular
  .module(moduleName, [
    legend,
    'ngTranslateAsyncLoader',
    spaceLeft,
    'ui.bootstrap',
  ])
  .component('cucSpaceMeter', cucCloudSpaceMeter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
