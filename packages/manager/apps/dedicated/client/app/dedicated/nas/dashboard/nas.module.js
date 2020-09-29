import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

const moduleName = 'ovhManagerNASDashboard';

angular.module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router']);

export default moduleName;
