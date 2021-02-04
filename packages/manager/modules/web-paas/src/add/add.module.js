import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';

import component from './add.component';
import routing from './add.routing';
import offersComponent from '../components/offers';
import templateComponent from '../components/project-template';

const moduleName = 'ovhManagerWebPaasAdd';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    ngOvhWebUniverseComponents,
    offersComponent,
    templateComponent,
  ])
  .config(routing)
  .component('webPaasAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
