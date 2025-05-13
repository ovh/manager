import angular from 'angular';
import '@uirouter/angularjs';

import dataSyncComponent from '../../../../../../components/pci-ai-data-sync';
import routing from './data-sync.routing';

const moduleName = 'ovhManagerPciNotebooksDashboardAttachDataDataSync';

angular.module(moduleName, ['ui.router', dataSyncComponent]).config(routing);

export default moduleName;
