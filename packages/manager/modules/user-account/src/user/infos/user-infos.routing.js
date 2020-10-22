import UserAccountInfosCtrl from './user-infos.controller';
import template from './user-infos.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'account.user.infos';

  $stateProvider.state(name, {
    url: '/infos',
    template,
    controller: UserAccountInfosCtrl,
    translations: {
      format: 'json',
      value: ['../newAccountForm'],
    },
  });
};
