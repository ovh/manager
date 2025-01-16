import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';
import installModal from '../../../component/install-node-modal/module';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './install-node.routing';

const moduleName = 'ovhManagerNutanixNodeInstall';

angular
  .module(moduleName, [
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    installModal,
  ])
  .config(routing);

export default moduleName;
