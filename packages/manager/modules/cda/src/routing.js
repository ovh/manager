export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda', {
    url: '/paas/cda',
    template: '<div data-ui-view="cdaDetails"></div>',
    translations: {
      format: 'json',
      value: ['.'],
    },
    abstract: true,
  });
};
