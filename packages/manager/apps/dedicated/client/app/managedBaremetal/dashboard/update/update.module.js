import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';

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
  .config(routing);

export default moduleName;
