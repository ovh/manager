import includes from 'lodash/includes';

import userEmailsTemplate from './user-emails.html';
import userEmailsDetailsTemplate from './details/user-emails-details.html';

import userEmailsController from './user-emails.controller';
import userEmailsDetailsController from './details/user-emails-details.controller';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  const name = 'app.account.user.emails';
  const nameDetails = 'app.account.user.emailsDetails';

  if (includes(['EU', 'CA'], coreConfigProvider.getRegion())) {
    $stateProvider.state(name, {
      url: '/emails',
      template: userEmailsTemplate,
      controller: userEmailsController,
      translations: ['../'],
    });

    $stateProvider.state(nameDetails, {
      url: '/emails/:emailId',
      template: userEmailsDetailsTemplate,
      controller: userEmailsDetailsController,
    });
  }
};
