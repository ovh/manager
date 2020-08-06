export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox-order', {
    url: '/order',
    component: 'overTheBoxOrder',
    translations: {
      value: ['.', '..'],
      format: 'json',
    },
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
