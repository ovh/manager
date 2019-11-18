import includes from 'lodash/includes';

export default /* @ngInject */($stateProvider, coreConfigProvider) => {
  const name = 'app.account.user.advanced';

  if (includes(['EU', 'CA'], coreConfigProvider.getRegion())) {
    $stateProvider.state(name, {
      url: '/advanced',
      component: 'accountUserAdvanced',
      translations: ['../'],
    });
  }
};
