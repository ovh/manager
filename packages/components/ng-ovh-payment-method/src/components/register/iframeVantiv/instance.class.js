import merge from 'lodash/merge';

import RegisterInstance from '../instance.class';
import { VANTIV_IFRAME_CONFIGURATION } from './constants';

export default class IframeVantivInstance extends RegisterInstance {
  constructor(instanceConfiguration) {
    super(instanceConfiguration);

    this.eProtectClient = null;
  }

  instanciate() {
    if (typeof EprotectIframeClient === 'undefined') {
      throw new Error("Could not download the vantiv's eProtect javascript library.");
    }

    this.eProtectClient = new EprotectIframeClient(merge(
      {},
      VANTIV_IFRAME_CONFIGURATION,
      this.configuration,
    ));

    super.instanciate();
  }

  submit(paymentMethod) {
    // ask to Vantiv if the informations provided in its iFrame are correct
    this.eProtectClient.getPaypageRegistrationId({
      id: `PM${paymentMethod.paymentMethodId}`,
    });

    return super.submit(paymentMethod);
  }
}
