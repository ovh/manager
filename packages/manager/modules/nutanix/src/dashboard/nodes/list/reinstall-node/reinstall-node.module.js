import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';
import reinstallModal from '../../../component/reinstall-node-modal/module';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './reinstall-node.routing';

const moduleName = 'ovhManagerNutanixNodeReinstall';

angular
  .module(moduleName, [
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    reinstallModal,
  ])
  .config(routing);

export default moduleName;
