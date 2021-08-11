<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>
import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManager<%= pascalcasedName %>LazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.**', {
      url: '/<%= name %>',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
