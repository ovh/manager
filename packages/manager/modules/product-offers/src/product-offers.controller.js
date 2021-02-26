import OrderWorkflow from './workflows/product-offers-order-workflow.class';
import ServicesWorkflow from './workflows/product-offers-services-workflow.class';

import { WORKFLOW_TYPES } from './workflows/product-offers-workflow.constants';

export default class ProductOffersController {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    coreConfig,
    ovhManagerProductOffersActionService,
    OrderCartService,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.actionService = ovhManagerProductOffersActionService;
    this.OrderCartService = OrderCartService;
  }

  $onInit() {
    if (!this.workflowType) {
      throw new Error('ovhProductOffersComponent: workflowType is undefined');
    }

    if (!this.workflowOptions) {
      throw new Error(
        'ovhProductOffersComponent: workflowOptions is undefined',
      );
    }

    switch (this.workflowType) {
      case WORKFLOW_TYPES.ORDER:
        this.workflow = new OrderWorkflow(
          this.$q,
          this.$timeout,
          this.$translate,
          this.workflowOptions,
          this.OrderCartService,
        );
        break;
      case WORKFLOW_TYPES.SERVICES:
        this.workflow = new ServicesWorkflow(
          this.$q,
          this.$timeout,
          this.$translate,
          this.workflowOptions,
          this.actionService,
        );
        break;
      default:
        break;
    }

    Object.assign(this.workflow, {
      pricingType: this.pricingType,
      sendCurrentState: this.sendCurrentState,
      user: this.coreConfig.getUser(),
      onError: this.onError,
      onSuccess: this.onSuccess,
    });
  }
}
