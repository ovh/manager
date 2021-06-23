import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedAccountContactsUpdateLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.account.contact-update-domain.**', {
      url: '/contact/:currentDomain/:contactId',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import(
          /* webpackChunkName: "contact-update" */ './user-contacts-update.module'
        ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });

    $stateProvider.state('app.account.contact-update.**', {
      url: '/contact/:contactId/',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import(
          /* webpackChunkName: "contact-update" */ './user-contacts-update.module'
        ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });

    $stateProvider.state('app.account.contact-update2.**', {
      url: '/contact/:contactId',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import(
          /* webpackChunkName: "contact-update" */ './user-contacts-update.module'
        ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  },
);

export default moduleName;
