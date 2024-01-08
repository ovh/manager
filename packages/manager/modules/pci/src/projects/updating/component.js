import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectUpdating',
  controller,
  template,
  bindings: {
    guideUrl: '<',
    pciProjectsHref: '<',
    onProjectUpdated: '<',
    onProjectUpdateFail: '<',
    orderId: '<',
    orderStatus: '<',
    voucherCode: '<?',
    discoveryPromotionVoucher: '<',
  },
};
