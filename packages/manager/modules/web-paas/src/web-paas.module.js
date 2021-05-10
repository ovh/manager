import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import moment from 'moment';

import add from './add';
import component from './web-paas.component';
import details from './details';
import onboarding from './onboarding';
import projects from './projects';
import routing from './web-paas.routing';
import service from './web-paas.service';

const moduleName = 'ovhManagerWebPaas';

angular
  .module(moduleName, [
    onboarding,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    details,
    add,
    projects,
  ])
  .config(routing)
  .component('webPaas', component)
  .service('WebPaas', service)
  .run(
    /* @ngInject */ ($translate) => {
      let lang = $translate.use();

      if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
        lang = lang.toLowerCase().replace('_', '-');
      } else {
        [lang] = lang.split('_');
      }

      return import(`script-loader!moment/locale/${lang}.js`).then(() =>
        moment.locale(lang),
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
