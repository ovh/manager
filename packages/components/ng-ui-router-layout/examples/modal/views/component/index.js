angular
  .module('myApp', ['ui.router', 'ui.bootstrap', 'ngUiRouterLayout'])
  .config(($stateProvider) => {
    $stateProvider.state('foo', {
      url: '/foo',
      views: {
        modal: {
          component: 'foo',
        },
      },
      layout: 'modal',
    });
  })
  .component('foo', {
    template: '<h2>Foo</h2>',
  });
