import { Price } from '@ovh-ux/manager-models';

import UpscaleService from '../upscale.service';

export default class {
  buildPrice() {
    const price = new Price(this.configuration.pricing);
    return UpscaleService.buildPriceToDisplay(
      price,
      this.connectedUser.language,
    );
  }
}
