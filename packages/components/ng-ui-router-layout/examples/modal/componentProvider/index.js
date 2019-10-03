angular
  .module('myApp', ['ui.router', 'ui.bootstrap', 'ngUiRouterLayout'])
  .config(($stateProvider) => {
    $stateProvider.state('foo', {
      url: '/foo',
      componentProvider: () => (Math.random() > 0.5 ? 'foo' : 'bar'),
      layout: 'modal',
    });
  })
  .component('foo', {
    template: '<h2>Foo</h2>',
  })
  .component('bar', {
    template: '<h2>The link should have said Bar</h2>',
  });
