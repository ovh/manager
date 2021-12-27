import angular from 'angular';
import '@uirouter/angularjs';

import deleteComponent from '../../../components/delete';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciAiAppsDashboardDelete';

angular.module(moduleName, ['ui.router', deleteComponent]).config(routing);

export default moduleName;
