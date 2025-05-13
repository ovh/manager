import angular from 'angular';
import '@uirouter/angularjs';
import routing from './routes';

const moduleName = 'managedBaremetalUpgradeRangeLazyloading';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
