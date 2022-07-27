import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhOtrs from '@ovh-ux/ng-ovh-otrs';
import { supportComponents } from '@ovh-ux/manager-support';

import component from './otrs.component';
import routing from './otrs.routes';
import service from './otrs.service';
import htmlStringLinkyFilter from './filter/html-string-linky.filter';

const moduleName = 'ovhManagerOtrs';

angular
  .module(moduleName, [
    'ngOvhUtils',
    ngOvhOtrs,
    'ngRoute',
    ovhManagerCore,
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    supportComponents,
  ])
  .config(
    /* @ngInject */ (OtrsPopupProvider, coreURLBuilderProvider) => {
      OtrsPopupProvider.setBaseUrlTickets(
        coreURLBuilderProvider.buildURL('dedicated', '#/ticket'),
      );
    },
  )
  .component('otrsComponent', component)
  .filter('htmlStringLinky', htmlStringLinkyFilter)
  .service('Otrs', service)
  .config(routing)
  .run(/* @ngInject */ (Otrs) => Otrs.init())
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
