import template from './email-domain-delegate-responder.html';

export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('app.email-delegate.dashboard.responder', {
    url: '/responder',
    template,
    controller: 'EmailDelegateResponderCtrl',
    controllerAs: 'ctrlEmailDelegateResponder',
  });
