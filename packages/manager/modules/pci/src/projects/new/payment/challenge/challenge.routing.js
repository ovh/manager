import get from 'lodash/get';
import { SESSION_DESCRIPTION_KEY } from './challenge.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.new.payment.challenge', {
      url: '/challenge?challenge&from&error',
      component: 'pciProjectNewPaymentChallenge',
      resolve: {
        saveDescriptionModel: getStepByName => () => {
          const descriptionModel = getStepByName('description').model;
          sessionStorage.setItem(SESSION_DESCRIPTION_KEY, JSON.stringify(descriptionModel));
        },
        restoreDescriptionModel: getStepByName => () => {
          if (sessionStorage.getItem(SESSION_DESCRIPTION_KEY)) {
            const descriptionStep = getStepByName('description');
            descriptionStep.model = JSON.parse(sessionStorage.getItem(SESSION_DESCRIPTION_KEY));
            sessionStorage.removeItem(SESSION_DESCRIPTION_KEY);
          }
        },
        challenge: /* @ngInject */ $transition$ => get($transition$.params(), 'challenge'),
        from: /* @ngInject */ $transition$ => get($transition$.params(), 'from'),
        error: /* @ngInject */ $transition$ => get($transition$.params(), 'error'),
        processChallenge: /* @ngInject */ (
          $state,
          $translate,
          CucCloudMessage,
          defaultPaymentMethod,
          displayRetryError,
          ovhPaymentMethod,
        ) => (challenge) => {
          CucCloudMessage.flushMessages();
          return ovhPaymentMethod
            .challengePaymentMethod(defaultPaymentMethod, challenge)
            .then(() => $state.go('pci.projects.new.payment', { challengeStatus: 'done' }, { reload: true }))
            .catch((error) => {
              if (error.status === 400) {
                $state.go('pci.projects.new.payment.challenge', { reload: true })
                  .then(() => displayRetryError());
              }
              if (error.status === 404) {
                $state.go('pci.projects.new.payment', { challengeStatus: 'done' }, { reload: true })
                  .then(() => CucCloudMessage.error(
                    $translate.instant('pci_projects_new_payment_challenge_error_deactivated'),
                  ));
              }
            });
        },
        displayRetryError: /* @ngInject */ (
          $translate,
          CucCloudMessage,
        ) => () => CucCloudMessage.error(
          $translate.instant('pci_projects_new_payment_challenge_error_retry'),
        ),

      },
    });
};
