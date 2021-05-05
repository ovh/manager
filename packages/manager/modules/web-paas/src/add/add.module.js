import angular from 'angular';

import '@ovh-ux/ui-kit';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';

import component from './add.component';
import routing from './add.routing';
import offersComponent from '../components/offers';
import templateComponent from '../components/project-template';
import additionalComponent from '../components/additional-option';
import deleteUser from './delete-user';
import userList from '../components/user-list';

const moduleName = 'ovhManagerWebPaasAdd';

angular
  .module(moduleName, [
    'oui',
    ngOvhWebUniverseComponents,
    additionalComponent,
    offersComponent,
    templateComponent,
    deleteUser,
    userList,
  ])
  .config(routing)
  .component('webPaasAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
