import angular from 'angular';
import 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import ngOvhDedicatedUniverseComponents from '@ovh-ux/ng-ovh-dedicated-universe-components';

import controller from './user-contracts-accept.controller';
import template from './user-contracts-accept.html';

const moduleName = 'UserContractsModal';

angular
  .module(moduleName, [
    ngOvhDedicatedUniverseComponents,
    ngTranslateAsyncLoader,
    'pascalprecht.translate',
  ])
  .controller('UserContractsAcceptModalCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'user-contracts/modal/user-contracts-accept.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
