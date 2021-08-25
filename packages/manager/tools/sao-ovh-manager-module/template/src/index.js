<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>
import angular from 'angular'
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManager<%= pascalcasedName %>LazyLoading';

angular.module(moduleName, ['ngUiRouterBreadcrumb', 'ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app', {
      url: '/<%= name %>',
      template: '<div data-ui-view></div>',
      redirectTo: 'app.index',
      resolve: {
        breadcrumb: () => '<%= name %>',
      },
    });
    $stateProvider.state('app.index.**', {
      url: '',
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
