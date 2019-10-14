angular
  .module('myApp', ['ui.router', 'ui.bootstrap', 'ngUiRouterLayout'])
  .config(($stateProvider) => {
    $stateProvider.state('foo', {
      url: '/foo',
      component: 'foo',
      layout: 'modalResolve',
      resolve: {
        redirectTo: () => 'an.other.state',
      },
    });
  })
  .component('foo', {
    template: '<h2>Foo</h2>',
  });
