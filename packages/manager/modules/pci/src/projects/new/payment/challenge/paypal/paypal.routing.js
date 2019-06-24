import isEmpty from 'lodash/isEmpty';
import { PAYMENT_TYPE_PAYPAL } from '../challenge.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.new.payment.challenge.challenge', {
      url: '/paypal?code&error_description&error',
      redirectTo: transition => transition.injector()
        .getAsync('restoreDescriptionModel')
        .then(restoreDescriptionModel => restoreDescriptionModel())
        .then(() => transition.injector().getAsync('shouldProcessChallenge'))
        .then((shouldProcessChallenge) => {
          if (shouldProcessChallenge) {
            const { code, error } = transition.params();

            if (isEmpty(error) && !isEmpty(code)) {
              return {
                state: 'pci.projects.new.payment.challenge',
                params: {
                  challenge: code,
                  from: PAYMENT_TYPE_PAYPAL,
                },
              };
            }

            if (!isEmpty(error)) {
              return {
                state: 'pci.projects.new.payment.challenge',
                params: {
                  error,
                  from: PAYMENT_TYPE_PAYPAL,
                },
              };
            }
            return { state: 'pci.projects.new.payment' };
          }
          return { state: 'pci.projects.new' };
        })
        .catch(() => ({ state: 'pci.projects.new' })),
    });
};
