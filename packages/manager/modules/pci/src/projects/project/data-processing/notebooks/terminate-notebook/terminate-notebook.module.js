import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from '../../components/terminate-notebook';
import routing from './terminate-notebook.routing';

const moduleName = 'ovhManagerPciProjectDataProcessingQuickTerminateModal';

angular.module(moduleName, ['ui.router', component]).config(routing);

export default moduleName;
