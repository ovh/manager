import { Price } from '@ovh-ux/manager-models';
import UpscaleService from '../upscale.service';

export default class {
  $onInit() {
    UpscaleService.validateLanguage(this.language);
  }

  buildPrice() {
    const price = new Price(this.price);
    return UpscaleService.buildPriceToDisplay(price, this.language);
  }
}
