import upperFirst from 'lodash/upperFirst';
import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $transitions,
    $translate,
    Alerter,
    orderService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$transitions = $transitions;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.orderService = orderService;
  }

  $onInit() {
    this.activationType = this.$transition$.params().activationType;
    this.currentStep = this.$transition$.params().goToConfiguration ? 'requiredConfiguration' : undefined;
    this.callerStateName = this.$state.$current.parent.name;
    this.steps = this.orderService.buildSteps(this.activationType);

    this.$transitions.onError(
      {
        to: `${this.callerStateName}.**`,
      },
      transition => (transition.error().type !== 6
        ? this.$q.when()
        : this
          .exit()
          .then(() => {
            this.Alerter.alertFromSWS(this.$translate.instant('dedicatedCloud_servicePack_confirmation_order_failure'), {
              message: get(transition.error(), 'detail', transition.error()).message,
              type: 'ERROR',
            }, 'dedicatedCloud_alert');
          })),
    );

    this[`handle${upperFirst(this.activationType)}Order`]();
  }

  handleBasicOrder() {
    this.title = this.$translate.instant('dedicatedCloud_servicePack_basic_header');
  }

  handleCertificationOrder() {
    this.title = this.$translate.instant('dedicatedCloud_servicePack_certification_header');
  }

  exit() {
    return this.$state.go(this.callerStateName);
  }
}
