import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';
import poweroffModal from '../../../component/poweroff-modal/module';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './poweroff-node.routing';

const moduleName = 'ovhManagerNutanixNodePowerOff';

angular
  .module(moduleName, [
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    poweroffModal,
  ])
  .config(routing);

export default moduleName;
