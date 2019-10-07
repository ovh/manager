angular
  .module('myApp', ['ui.router', 'ui.bootstrap', 'ngUiRouterLayout'])
  .config(($stateProvider) => {
    $stateProvider.state('component', {
      url: '/component',
      component: 'component',
      layout: 'ouiModal',
      resolve: {
        redirectTo: () => 'a.state.of.your.choice',
        heading: () => 'ouiModal layout used with component',
        primaryLabel: () => 'Primary button',
        primaryAction: () => () => {
          alert('primary button is clicked !');
        },
        secondaryLabel: () => 'Secondary button',
        secondaryAction: () => () => {
          alert('secondary button is clicked !');
        },
        model: () => ({
          firstname: 'Sullyvan',
        }),
      },
    });
  })
  .component('component', {
    template: '<h2>Hello {{ $ctrl.resolve.model.firstname }}!</h2>',
  });
