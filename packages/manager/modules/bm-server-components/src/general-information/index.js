import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import { sshKeySelector } from '@ovh-ux/manager-components';

import inputs from './inputs';
import gabarit from './installation/gabarit';
import ovh from './installation/ovh';
import progress from './installation/progress';

import component from './general-information.component';

const moduleName = 'ovhManagerBmServerComponentsDashboardGeneralInformation';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    ngOvhFeatureFlipping,
    sshKeySelector,
    inputs,
    gabarit,
    ovh,
    progress,
  ])
  .component('serverGeneralInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
