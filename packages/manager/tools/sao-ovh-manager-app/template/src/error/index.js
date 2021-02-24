import angular from 'angular';
<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManager<%= pascalcasedName %>ErrorPageLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('error.**', {
      url: '/error',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./error.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
