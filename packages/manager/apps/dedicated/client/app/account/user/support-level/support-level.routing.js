export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.user.support-level';

  $stateProvider.state(name, {
    url: '/support/level',
    component: 'accountUserSupportLevel',
    translations: {
      format: 'json',
      value: ['./'],
    },
  });
};
