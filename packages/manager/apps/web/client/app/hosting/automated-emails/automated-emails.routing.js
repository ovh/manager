import template from './AUTOMATED_EMAILS.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.automated-emails', {
    url: '/automated-emails',
    template,
    controller: 'HostingTabAutomatedEmailsCtrl',
  });
};
