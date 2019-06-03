import find from 'lodash/find';
import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.new.payment', {
      url: '/payment?mode&credit&voucher&hiPayStatus&paypalAgreementStatus',
      redirectTo: (transition) => {
        const { hiPayStatus, mode, projectId } = transition.params();

        if (hiPayStatus === 'success' && mode === 'credits' && projectId) {
          return {
            state: 'pci.projects.project',
            params: {
              projectId,
            },
          };
        }

        return null;
      },
      onEnter: /* @ngInject */ ($transition$, $window, getStepByName, newProjectInfo,
        PciProjectNewService) => {
        // check for paypal response in query string
        if ($window.location.search.indexOf('paypalAgreementStatus') > -1) {
          // in that case we will redirect to pci.projects.new.payment
          // with query string as query params...
          // first abort transition
          $transition$.abort();

          // then redirect
          const hashContainsQuery = $window.location.hash.indexOf('?') > -1;
          let targetUrl = $window.location.href.replace($window.location.search, '');
          targetUrl = `${targetUrl}${hashContainsQuery ? $window.location.search.replace('?', '&') : $window.location.search}`;
          return $window.location.replace(targetUrl);
        }

        // check for payment response in state params
        const stateParams = $transition$.params();
        const descriptionModel = getStepByName('description').model;
        if (stateParams.hiPayStatus || stateParams.paypalAgreementStatus) {
          // set model from state params
          const paymentModel = getStepByName('payment').model;

          // set description step model
          descriptionModel.name = stateParams.description;
          descriptionModel.agreements = true;

          // set payment step model
          if (stateParams.voucher) {
            paymentModel.voucher = {
              valid: true,
              value: stateParams.voucher,
            };
          }
          paymentModel.credit.value = parseInt(stateParams.credit, 10);
          paymentModel.projectId = stateParams.projectId;

          // if there is an error from HiPay and a projectId is setted
          // (in other words: if credit payment in error)
          // cancel project creation and redirect refresh page
          const { hiPayStatus, projectId } = $transition$.params();
          if (hiPayStatus !== 'success' && !newProjectInfo.order && projectId) {
            return PciProjectNewService
              .cancelProjectCreation(projectId)
              .then(() => $window.location.reload());
          }

          return true;
        }

        // if no payment status check if we can access to this state
        if (!descriptionModel.agreements) {
          return $transition$.router.stateService.target('pci.projects.new');
        }

        return true;
      },
      component: 'pciProjectNewPayment',
      resolve: {
        paymentModel: /* @ngInject */ ($transition$, steps) => {
          const currentStep = find(steps, {
            name: 'payment',
          });
          currentStep.model.mode = get($transition$.params(), 'mode', 'paymentMethod');
          return currentStep.model;
        },
        creditMinPrice: /* @ngInject */ (me, PciProjectNewService) => PciProjectNewService
          .getFormattedCatalog(me.ovhSubsidiary)
          .then(catalog => get(find(catalog.plans, {
            planCode: 'credit.default',
          }), 'details.pricings.default[0].price')),
      },
    });
};
