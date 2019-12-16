import angular from 'angular';
import 'angular-translate';
import 'ovh-ui-angular';
import ngOvhContracts from '@ovh-ux/ng-ovh-contracts';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import orderComponent from './order.component';

const moduleName = 'wucOrderModule';

angular
  .module(moduleName, [
    'oui',
    ngOvhContracts,
    ngTranslateAsyncLoader,
    'pascalprecht.translate',
  ])
  .component(orderComponent.name, orderComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
