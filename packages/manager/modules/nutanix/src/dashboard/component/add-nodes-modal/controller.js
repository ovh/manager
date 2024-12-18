import { MAX_NODES_BY_CLUSTER } from '../../../constants';

export default class {
  /* @ngInject */
  constructor($window, $translate) {
    this.$translate = $translate;
    this.$window = $window;
    this.numberOfNodes = 1;

    this.defineCustomErrorMessages();
  }

  get maxNodeToBuy() {
    return MAX_NODES_BY_CLUSTER - this.cluster.targetSpec.nodes.length;
  }

  get informationsClusterNode() {
    return {
      currentNumberOfNodes: this.cluster.targetSpec.nodes.length,
      maxNumberOfNodes: MAX_NODES_BY_CLUSTER,
    };
  }

  defineCustomErrorMessages() {
    this.customErrorMessages = {
      max: this.$translate.instant(
        'nutanix_dashboard_add_nodes_error_too_many_nodes',
      ),
      min: this.$translate.instant(
        'nutanix_dashboard_add_nodes_error_not_enough_nodes',
      ),
    };
  }

  get nodePriceText() {
    return this.nodePricing.price.text;
  }

  generateOrderExpressLink() {
    this.nodeOrderLinkGenerator.setQuantity(this.numberOfNodes);
    const expressOrderParams = this.nodeOrderLinkGenerator.generateLinkParams();

    return `${this.expressOrderLink}?products=${expressOrderParams}`;
  }

  onSubmit() {
    if (this.cancelSubscriptionForm.$invalid) {
      return;
    }

    this.openExpressOrderTab();

    this.handleSuccess(
      `${this.$translate.instant(
        'nutanix_dashboard_add_nodes_success_banner',
      )}<a href="${this.generateOrderExpressLink()}" target="_blank" rel="nooponer">${this.$translate.instant(
        'nutanix_dashboard_add_nodes_success_banner_link_label',
      )}</a>`,
    );
  }

  openExpressOrderTab() {
    this.$window.open(this.generateOrderExpressLink(), '_blank');
  }
}
