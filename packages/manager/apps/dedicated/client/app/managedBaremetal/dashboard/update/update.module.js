import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './update.component';
import routing from './update.routing';
import updateVersionComponent from '../../../components/dedicated-cloud/dashboard/update';

const moduleName = 'managedBaremetalDashboardUpdate';

angular
  .module(moduleName, [
    ngAtInternet,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    updateVersionComponent,
  ])
  .config(routing)
  .component('ovhManagerPccDashboardUpdate', component);

export default moduleName;
