import reduce from 'lodash/reduce';
import { GUIDES } from './constants';
import illustration from './assets/Nutanix.png';

export default class NutanixOnboardingCtrl {
  constructor() {
    this.GUIDES = GUIDES;
  }

  $onInit() {
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
        },
      ],
      [],
    );
    this.illustration = illustration;
  }
}
