import JSURL from 'jsurl';
import { PRODUCT_ID, DEFAULT_OS_NODE_NUTANIX } from '../constants';

export default class NodeExpressOrderLinkGenerator {
  constructor(serviceName, nodeDetails, zone, quantity = 1) {
    this.serviceName = serviceName;
    this.nodeTechnicalDetails = nodeDetails.serviceDetails;
    this.zone = zone;
    this.quantity = quantity;
    this.options = this.generateOptions(nodeDetails.optionsDetails);
  }

  setQuantity(quantity) {
    this.quantity = quantity;
  }

  generateOptions(nodeOptionsDetails) {
    return nodeOptionsDetails.map((option) => ({
      planCode: option.billing.plan.code,
      duration: this.nodeTechnicalDetails.billing.pricing.duration,
      pricingMode: this.nodeTechnicalDetails.billing.pricing.pricingMode,
      quantity: this.quantity,
    }));
  }

  generateLinkParams() {
    return JSURL.stringify([
      {
        serviceName: this.serviceName,
        planCode: this.nodeTechnicalDetails.billing.plan.code,
        quantity: this.quantity,
        productId: PRODUCT_ID,
        duration: this.nodeTechnicalDetails.billing.pricing.duration,
        pricingMode: this.nodeTechnicalDetails.billing.pricing.pricingMode,
        configuration: [
          { label: 'dedicated_datacenter', value: this.zone },
          { label: 'dedicated_os', value: DEFAULT_OS_NODE_NUTANIX },
        ],
        option: this.options.map((option) => ({
          ...option,
          quantity: this.quantity,
        })),
      },
    ]);
  }
}
