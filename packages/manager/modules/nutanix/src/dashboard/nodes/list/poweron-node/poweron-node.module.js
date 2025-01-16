import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';
import poweronModal from '../../../component/poweron-modal/module';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './poweron-node.routing';

const moduleName = 'ovhManagerNutanixNodePowerOn';

angular
  .module(moduleName, [
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    poweronModal,
  ])
  .config(routing);

export default moduleName;
