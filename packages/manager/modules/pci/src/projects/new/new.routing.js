import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';
import includes from 'lodash/includes';
import map from 'lodash/map';
import merge from 'lodash/merge';

import { PCI_REDIRECT_URLS } from '../../constants';
import { CHALLENGE_PAYMENT_TYPE_SUPPORTED } from './payment/challenge/challenge.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.new', {
      url: '/new?description&projectId',
      views: {
        '@pci': {
          component: 'pciProjectNew',
        },
      },
      redirectTo: (transition) => {
        const newProjectInfoPromise = transition.injector().getAsync('newProjectInfo');
        return newProjectInfoPromise
          .then(({ error }) => {
            if (error && error.code !== 'challengePaymentMethodRequested') {
              return transition.router.stateService.target(
                'pci.error',
                merge({
                  context: 'projectCreation',
                }, error), {
                  location: false,
                },
              );
            }

            return null;
          });
      },
      resolve: {
        breadcrumb: () => null,

        contracts: /* @ngInject */ ($q, newProjectInfo, PciProjectNewService) => {
          const agreementPromises = map(
            newProjectInfo.agreements || [],
            id => PciProjectNewService.getNewProjectAgreementContract(id)
              .then(contract => Object.assign(contract, {
                id,
              })),
          );

          return $q.all(agreementPromises);
        },

        paymentStatus: /* @ngInject */ $transition$ => get($transition$.params(), 'paymentStatus'),

        getCurrentStep: /* @ngInject */ ($state, getStepByName) => () => {
          if ($state.current.name === 'pci.projects.new') {
            return getStepByName('description');
          }

          return getStepByName('payment');
        },

        getStepByName: /* @ngInject */ steps => stepName => find(steps, {
          name: stepName,
        }),

        getStateLink: /* @ngInject */ (
          $state,
          getCurrentStep,
        ) => (action, inherit = true) => {
          switch (action) {
            case 'cancel':
              return $state.href('pci.projects');
            case 'credits':
              return $state.href('pci.projects.new.payment', {
                mode: action,
              });
            case 'payment':
              return $state.href('pci.projects.new.payment', {
                mode: null,
              }, {
                inherit,
              });
            default:
              if (getCurrentStep().name === 'description') {
                return $state.href('pci.projects.new.payment');
              }

              return $state.href('pci.projects');
          }
        },

        shouldProcessChallenge: /* @ngInject */ (
          $state,
          atInternet,
          getCurrentStep,
          newProjectInfo,
        ) => () => {
          const page = `public-cloud::${$state.current.name.replace(/\./g, '::')}`;
          const currentStep = getCurrentStep();

          const isValidDefaultPaymentMethod = has(currentStep.model, 'defaultPaymentMethod') && includes(
            CHALLENGE_PAYMENT_TYPE_SUPPORTED,
            get(currentStep.model, 'defaultPaymentMethod.paymentType.value'),
          );
          const shouldProcessChallenge = get(newProjectInfo, 'error.code') === 'challengePaymentMethodRequested' && isValidDefaultPaymentMethod;

          if (shouldProcessChallenge) {
            atInternet.trackEvent({
              page,
              event: 'PCI_PROJECTS_NEW_CHALLENGE',
            });
          }

          return shouldProcessChallenge;
        },

        hasCreditToOrder: /* @ngInject */ (
          $state,
          atInternet,
          getCurrentStep,
          newProjectInfo,
          paymentStatus,
        ) => () => {
          const page = `public-cloud::${$state.current.name.replace(/\./g, '::')}`;
          const currentStep = getCurrentStep();

          const hasCreditToOrder = newProjectInfo.order
            && ((!paymentStatus && currentStep.model.defaultPaymentMethod)
            || ['success', 'accepted'].includes(paymentStatus)
            );

          if (hasCreditToOrder) {
            atInternet.trackEvent({
              page,
              event: 'PCI_PROJECTS_NEW_SUSPICIOUS',
            });
          }

          return hasCreditToOrder;
        },

        dlpStatus: /* @ngInject */ ($q, PciProjectNewService) => PciProjectNewService
          .getDlpStatus()
          .catch((error) => {
            if (error.status === 404) {
              return null;
            }
            return $q.reject(error);
          }),

        paymentMethodUrl: /* @ngInject */ coreConfig => get(
          PCI_REDIRECT_URLS,
          `${coreConfig.getRegion()}.paymentMethods`,
        ),

        project: /* @ngInject */ ($q, $transition$, PciProjectNewService) => {
          if ($transition$.params().projectId) {
            return PciProjectNewService
              .getProject($transition$.params().projectId)
              .catch((error) => {
                if (error.status === 404) {
                  return null;
                }
                return $q.reject(error);
              });
          }
          return null;
        },

        newProjectInfo: /* @ngInject */ ($timeout, $transition$, coreConfig, ovhPaymentMethod,
          paymentStatus, PciProjectNewService) => {
          const newProjectInfoThen = (response) => {
            const transformedResponse = response;
            // if there is an error when returning from HiPay
            // and that a projectId is present in the URL (meaning that a credit has been paid)
            // force error to null to avoid too many project error display
            if (transformedResponse.error
              && paymentStatus
              && get($transition$.params(), 'projectId')) {
              transformedResponse.error = null;
            }
            return transformedResponse;
          };

          // if region is US return an empty object as API call does not exist in US
          // and project creation is redirected to express order
          if (coreConfig.isRegion('US')) {
            return {};
          }
          if (['success', 'accepted'].includes(paymentStatus)) {
            // wait for new payment method validation
            const checkValidPaymentMethod = (iteration = 0) => $timeout(
              () => ovhPaymentMethod.hasDefaultPaymentMethod(),
              iteration * 1000,
            )
              .then((hasDefaultPaymentMethod) => {
                if (!hasDefaultPaymentMethod && iteration < 10) {
                  return checkValidPaymentMethod(iteration + 1);
                }
                return PciProjectNewService.getNewProjectInfo()
                  .then(newProjectInfoThen);
              });
            return checkValidPaymentMethod();
          }
          return PciProjectNewService.getNewProjectInfo()
            .then(newProjectInfoThen);
        },

        onDescriptionStepFormSubmit: /* @ngInject */ ($state, $window) => (navigateToUrl, url) => {
          if (navigateToUrl) {
            return $window.open(url);
          }
          return $state.go('pci.projects.new.payment');
        },

        onProjectCreated: /* @ngInject */ $state => projectId => $state.go(
          'pci.projects.project', {
            projectId,
          },
        ),

        steps: () => [{
          name: 'description',
          loading: {},
          model: {
            name: null,
            agreements: false,
          },
        }, {
          name: 'payment',
          loading: {},
          model: {
            voucher: {
              valid: false,
              value: null,
              paymentMethodRequired: null,
              submitted: false,
            },
            selectedPaymentMethodType: null,
            mode: null,
            credit: {
              value: null,
            },
            projectId: null,
          },
        }],

        trackingPage: /* @ngInject */ $transition$ => `public-cloud::${$transition$.to().name.replace(/\./g, '::')}`,
      },
    });
};
