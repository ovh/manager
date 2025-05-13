import {
  isKYCValid,
  isKYCPending,
  isKYCInError,
} from '../sva-wallet.constants';

export default class ProfileTileController {
  $onInit() {
    this.svaWalletStatus = {
      valid: isKYCValid(this.svaWallet),
      pending: isKYCPending(this.svaWallet),
      error: isKYCInError(this.svaWallet),
    };
  }
}
