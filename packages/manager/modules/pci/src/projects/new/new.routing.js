import find from 'lodash/find';
import get from 'lodash/get';
import EnvironmentService from '@ovh-ux/manager-config';

import { PCI_REDIRECT_URLS } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.new', {
      url: '/new?description&projectId',
      component: 'pciProjectNew',
      resolve: {
        paymentStatus: /* @ngInject */ $transition$ => get($transition$.params(), 'hiPayStatus')
            || get($transition$.params(), 'paypalAgreementStatus'),
        getCurrentStep: /* @ngInject */ ($state, getStepByName) => () => {
          if ($state.current.name === 'pci.projects.new') {
            return getStepByName('description');
          }

          return getStepByName('payment');
        },
        getStepByName: /* @ngInject */ steps => stepName => find(steps, {
          name: stepName,
        }),
        getStateLink: /* ngInject */ ($state, getCurrentStep) => (action) => {
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
              });
            default:
              if (getCurrentStep().name === 'description') {
                return $state.href('pci.projects.new.payment');
              }

              return $state.href('pci.projects');
          }
        },
        dlpStatus: () => null,
        // dlpStatus: /* @ngInject */ ($q, PciProjectNewService) => PciProjectNewService
        //   .getDlpStatus()
        //   .catch((error) => {
        //     if (error.status === 404) {
        //       return null;
        //     }
        //     return $q.reject(error);
        //   }),
        paymentMethodUrl: () => get(
          PCI_REDIRECT_URLS,
          `${EnvironmentService.Environment.region}.paymentMethods`,
        ),
        newProjectInfo: /* @ngInject */ PciProjectNewService => PciProjectNewService
          .getNewProjectInfo(),
        onProjectCreated: /* @ngInject */ $state => projectId => $state.go(
          'pci.projects.project.creating', {
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
            },
            defaultPaymentMethod: null,
            paymentType: null,
            mode: null,
            credit: {
              value: null,
            },
            projectId: null,
          },
        }],
      },
    });
};
