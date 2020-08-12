import template from './email-domain-email-acl.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.email.acl', {
    url: '/acl',
    template,
    controller: 'EmailDomainEmailAclCtrl',
    controllerAs: 'ctrlEmailDomainEmailAcl',
  });
};
