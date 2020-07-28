export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBox-order', {
    url: '/overTheBox/order',
    component: 'overTheBoxOrder',
    translations: {
      value: ['.', '..'],
      format: 'json',
    },
  });
};
