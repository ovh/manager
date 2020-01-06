import find from 'lodash/find';
import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.new.payment', {
    url: '/payment?mode&credit&voucher&paymentStatus&challengeStatus',
    redirectTo: (transition) => {
      const { paymentStatus, mode, projectId } = transition.params();

      if (paymentStatus === 'success' && mode === 'credits' && projectId) {
        return {
          state: 'pci.projects.project',
          params: {
            projectId,
          },
        };
      }

      return null;
    },
    onEnter: /* @ngInject */ (
      $transition$,
      $window,
      atInternet,
      getStepByName,
      PciProjectNewService,
      project,
      trackingPage,
    ) => {
      // check for payment response in state params
      const stateParams = $transition$.params();
      const descriptionModel = getStepByName('description').model;
      if (
        stateParams.paymentStatus ||
        stateParams.paypalAgreementStatus ||
        stateParams.challengeStatus === 'done'
      ) {
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
            submitted: true,
          };
        }
        paymentModel.credit.value = parseInt(stateParams.credit, 10);
        paymentModel.projectId = stateParams.projectId;

        // if there is an error from HiPay and a projectId is setted
        // (in other words: if credit payment in error)
        // cancel project creation and redirect refresh page
        const { paymentStatus, projectId } = $transition$.params();
        if (
          paymentStatus !== 'success' &&
          get(project, 'status') === 'creating' &&
          projectId
        ) {
          atInternet.trackEvent({
            page: trackingPage,
            event: projectId
              ? 'PCI_ERROR_REFUSED_PAYMENT_CREDIT'
              : 'PCI_ERROR_REFUSED_PAYMENT',
          });

          return PciProjectNewService.cancelProjectCreation(projectId).then(
            () => $window.location.reload(),
          );
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
        currentStep.model.mode = get(
          $transition$.params(),
          'mode',
          'paymentMethod',
        );
        return currentStep.model;
      },
      creditMinPrice: /* @ngInject */ (
        CucCurrencyService,
        cucUcentsToCurrencyFilter,
        me,
        PciProjectNewService,
      ) =>
        PciProjectNewService.getFormattedCatalog(me.ovhSubsidiary).then(
          (catalog) => {
            const price = get(
              find(catalog.plans, {
                planCode: 'credit.default',
              }),
              'pricings[0].price',
            );
            return {
              currencyCode: catalog.locale.currencyCode,
              text: cucUcentsToCurrencyFilter(price),
              value: CucCurrencyService.convertUcentsToCurrency(price),
            };
          },
        ),
    },
  });
};
