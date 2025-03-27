import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';
import uninstallModal from '../../../component/uninstall-modal/module';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './uninstall-node.routing';

const moduleName = 'ovhManagerNutanixNodePowerOff';

angular
  .module(moduleName, [
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    uninstallModal,
  ])
  .config(routing);

export default moduleName;
