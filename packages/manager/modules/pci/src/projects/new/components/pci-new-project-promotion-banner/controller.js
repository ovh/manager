import { ACTIVE_VOUCHERS } from './constants';

export default class PciNewProjectPromotionBannerController {
  isVoucherValid() {
    return ACTIVE_VOUCHERS.includes(this.voucher.value) && this.voucher.valid;
  }
}
