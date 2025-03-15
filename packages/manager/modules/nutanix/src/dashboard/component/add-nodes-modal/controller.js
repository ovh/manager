import { MAX_NODES_BY_CLUSTER } from '../../../constants';

export default class {
  /* @ngInject */
  constructor($window, $translate, $locale) {
    this.$translate = $translate;
    this.$window = $window;
    this.userLanguage = $locale.localeID.replace('_', '-');
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
    return new Intl.NumberFormat(this.userLanguage, {
      style: 'currency',
      currency: this.nodePricing.currency,
    }).format(this.nodePricing.priceInUcents / 1e8);
  }

  generateOrderExpressLink() {
    this.nodeOrderLinkGenerator.setQuantity(this.numberOfNodes);
    const expressOrderParams = this.nodeOrderLinkGenerator.generateLinkParams();

    return `${this.expressOrderLink}?products=${expressOrderParams}`;
  }

  generateSuccessMessage() {
    const successMessage = this.$translate.instant(
      'nutanix_dashboard_add_nodes_success_banner',
    );
    const helpLinkLabel = this.$translate.instant(
      'nutanix_dashboard_add_nodes_success_banner_link_label',
    );
    const orderExpressLink = this.generateOrderExpressLink();

    return `${successMessage}<a href="${orderExpressLink}" target="_blank" rel="nooponer">${helpLinkLabel}</a>`;
  }

  onSubmit() {
    if (this.cancelSubscriptionForm.$invalid) {
      return;
    }

    this.openExpressOrderTab();

    this.handleSuccess(this.generateSuccessMessage());
  }

  openExpressOrderTab() {
    this.$window.open(this.generateOrderExpressLink(), '_blank');
  }
}
