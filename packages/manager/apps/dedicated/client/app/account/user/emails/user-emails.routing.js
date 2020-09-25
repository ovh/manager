import includes from 'lodash/includes';

angular
  .module('UserAccount')
  .config(
    /* @ngInject */ ($stateProvider, coreConfigProvider) => {
      const name = 'app.account.user.emails';
      const nameDetails = 'app.account.user.emails.emailsDetails';

      if (includes(['EU', 'CA'], coreConfigProvider.getRegion())) {
        $stateProvider.state(name, {
          url: '/emails',
          templateUrl: 'account/user/emails/user-emails.html',
          controller: 'UserAccount.controllers.emails',
          translations: ['../'],
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('user_emails'),
          },
        });

        $stateProvider.state(nameDetails, {
          url: '/:emailId',
          templateUrl: 'account/user/emails/details/user-emails-details.html',
          controller: 'UserAccount.controllers.emails.details',
          resolve: {
            emailId: /* @ngInject */ ($transition$) =>
              $transition$.params().emailId,
            breadcrumb: /* @ngInject */ (emailId) => emailId,
          },
        });
      }
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);
