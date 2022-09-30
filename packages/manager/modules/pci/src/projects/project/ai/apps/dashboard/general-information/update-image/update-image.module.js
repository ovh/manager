import angular from 'angular';
import '@uirouter/angularjs';

import updateImageComponent from '../../../components/update-image';
import routing from './update-image.routing';

const moduleName = 'ovhManagerPciAppsAppDashboardAppUpdateImage';

angular.module(moduleName, ['ui.router', updateImageComponent]).config(routing);

export default moduleName;
