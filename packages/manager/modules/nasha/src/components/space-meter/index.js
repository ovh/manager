import angular from 'angular';

import 'angular-ui-bootstrap';
import '@ovh-ux/ng-translate-async-loader';

import legend from './legend';
import spaceLeft from './space-left';

import component from './component';

import './index.less';

const moduleName = 'ovhManagerNashaComponentsSpaceMeter';

angular
  .module(moduleName, [
    'ui.bootstrap',
    'ngTranslateAsyncLoader',
    legend,
    spaceLeft,
  ])
  .component('nashaComponentsSpaceMeter', component);

export default moduleName;
