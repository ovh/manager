import angular from 'angular';
import '@ovh-ux/ng-ovh-user-pref';
import '@uirouter/angularjs';
import 'angular-ui-bootstrap';

import controller from './controller';

import './index.less';

const moduleName = 'ovhManagerPciProjectOnboarding';

angular
  .module(moduleName, [
    'ngOvhUserPref',
    'ui.bootstrap',
    'ui.router',
  ])
  .controller('pciSlideshowCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
