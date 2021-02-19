import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import contactUpdate from './update/user-contacts-update.module';
import service from './user-contacts.service';

const moduleName = 'ovhManagerDedicatedAccountContactsLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', contactUpdate])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.account.contacts.**', {
        url: '/contacts',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import(
            /* webpackChunkName: "contacts" */ './user-contacts.module'
          ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      });
    },
  )
  .service('UserAccountContactsService', service);

export default moduleName;
