export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard', {
    url: '/:serviceName',
    redirectTo: 'cda.dashboard.cda-details',
    template: '<div data-ui-view="cdaDetails"></div>',
    translations: {
      format: 'json',
      value: ['.'],
    },
  });
};
