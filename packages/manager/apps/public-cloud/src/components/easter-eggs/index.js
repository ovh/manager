import angular from 'angular';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-ui-angular';

import component from './easter-eggs.component';

const moduleName = 'publicCloudEasterEggs';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
  ])
  .component('publicCloudEasterEggs', component)
  .run(/* @ngTranslationsInject:json ./modal/translations */);

export default moduleName;
