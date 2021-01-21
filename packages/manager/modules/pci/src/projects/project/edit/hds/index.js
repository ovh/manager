import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-contracts';

import component from './hds.component';
import hdsOption from '../../../../components/hds';

const moduleName = 'editHdsOption';

angular
  .module(moduleName, [
    hdsOption,
    'pascalprecht.translate',
    'oui',
    'ngOvhContracts',
  ])
  .component('editHdsOption', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
