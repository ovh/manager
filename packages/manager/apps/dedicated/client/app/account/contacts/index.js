import angular from 'angular';
import get from 'lodash/get';
import has from 'lodash/has';
import last from 'lodash/last';
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
  .config(
    /* @ngInject */ ($urlRouterProvider) => {
      // ensure compatibility with links sended by emails
      // like #/useraccount/contacts/1124580?tab=REQUESTS&token=myToken
      // make a redirect to the new url of ui route
      $urlRouterProvider.when(
        /^\/useraccount\/contacts\/[0-9]+$/,
        ($location, $state) => {
          const hasToken = has($location.search(), 'token');
          const requestTabAsked = get($location.search(), 'tab') === 'REQUESTS';

          if (!hasToken || !requestTabAsked) {
            return false;
          }

          const taskId = last($location.path().split('/'));
          const token = get($location.search(), 'token');

          return $state.go('app.account.contacts.requests', { taskId, token });
        },
      );
    },
  )
  .service('UserAccountContactsService', service);

export default moduleName;
