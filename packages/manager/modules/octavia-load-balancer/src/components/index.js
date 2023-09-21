import angular from 'angular';

import ngAtInternet from '@ovh-ux/ng-at-internet';
import instancesTable from './instances-table';

const moduleName = 'ngOvhOctaviaComponents';

angular.module(moduleName, [instancesTable, ngAtInternet]);

export default moduleName;
