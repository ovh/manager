import controller from './user-emails.controller';
import template from './user-emails.html';
import detailsController from './details/user-emails-details.controller';
import detailsTemplate from './details/user-emails-details.html';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  const name = 'account.user.emails';
  const nameDetails = 'account.user.emails.emailsDetails';

  if (coreConfigProvider.isRegion(['EU', 'CA'])) {
    $stateProvider.state(name, {
      url: '/emails',
      controller,
      template,
      translations: ['../'],
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('user_emails'),
      },
    });

    $stateProvider.state(nameDetails, {
      url: '/:emailId',
      template: detailsTemplate,
      controller: detailsController,
      resolve: {
        emailId: /* @ngInject */ ($transition$) =>
          $transition$.params().emailId,
        breadcrumb: /* @ngInject */ (emailId) => emailId,
      },
    });
  }
};
