import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import dashboardTile from './dashboard-tile';
import listModal from './list-modal';
import tagManager from './manager';

import component from './component';
import service from './service';

const moduleName = 'ovhManagerResourceTagging';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    dashboardTile,
    listModal,
    tagManager,
  ])
  .component('ovhManagerResourceTagging', component)
  .service('ovhManagerResourceTaggingService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
