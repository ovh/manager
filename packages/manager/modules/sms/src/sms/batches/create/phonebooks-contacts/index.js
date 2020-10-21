import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerSmsBatchesCreatePhonebooksContacts';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', 'ovhManagerCore'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'sms.service.batches.create.phonebooks-contacts.**',
        {
          url: '/phonebooks-contacts',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import(
              './telecom-sms-batches-create-phonebooks-contacts.module'
            ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
          },
        },
      );
    },
  );

export default moduleName;
