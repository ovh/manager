import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';
import addNodeComponent from '../../../component/add-nodes-modal/module';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './add-nodes.routing';

const moduleName = 'ovhManagerNutanixNodesAllAddNodes';

angular
  .module(moduleName, [
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    addNodeComponent,
  ])
  .config(routing);

export default moduleName;
