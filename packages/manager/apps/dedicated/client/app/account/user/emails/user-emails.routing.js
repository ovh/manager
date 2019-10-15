import _ from 'lodash';

angular
  .module('UserAccount')
  .config(/* @ngInject */($stateProvider, coreConfigProvider) => {
    const name = 'app.account.user.emails';
    const nameDetails = 'app.account.user.emailsDetails';

    if (_.includes(['EU', 'CA'], coreConfigProvider.getRegion())) {
      $stateProvider.state(name, {
        url: '/emails',
        templateUrl: 'account/user/emails/user-emails.html',
        controller: 'UserAccount.controllers.emails',
        translations: ['../'],
      });

      $stateProvider.state(nameDetails, {
        url: '/emails/:emailId',
        templateUrl: 'account/user/emails/details/user-emails-details.html',
        controller: 'UserAccount.controllers.emails.details',
      });
    }
  });
