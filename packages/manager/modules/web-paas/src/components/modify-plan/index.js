import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';
import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './modify-plan.component';
import offersComponent from '../offers';
import templateComponent from '../project-template';
import additionalOptionComponent from '../additional-option';
import userList from '../user-list';

const moduleName = 'ovhManagerWebPaasModifyPlan';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    ngOvhWebUniverseComponents,
    ovhManagerCatalogPrice,
    additionalOptionComponent,
    offersComponent,
    templateComponent,
    userList,
  ])
  .component('webPaasModifyPlan', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
