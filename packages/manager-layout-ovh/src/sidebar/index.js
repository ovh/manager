import angular from 'angular';
import sidebarMenu from 'ovh-angular-sidebar-menu';

import { SIDEBAR_CONFIG, STATE_MAPPING_SERVICE } from './sidebar.constants';

import template from './sidebar.html';
import controller from './sidebar.controller';


export default angular
  .module('ovh-manager-sidebar', [sidebarMenu])
  .component('ovhManagerSidebar', {
    template,
    controller,
  })
  .constant('SIDEBAR_CONFIG', SIDEBAR_CONFIG)
  .constant('SIDEBAR_STATE_MAPPING_SERVICE', STATE_MAPPING_SERVICE)
  .run(($translate, asyncLoader) => {
    asyncLoader.addTranslations(
      import(`./translations/Messages_${$translate.use()}.xml`)
        .catch(() => import(`./translations/Messages_${$translate.fallbackLanguage()}.xml`))
        .then(x => x.default),
    );
    $translate.refresh();
  })
  .name;
