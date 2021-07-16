import find from 'lodash/find';

import { EXCLUDE_FLAVOR_CATEGORIES } from './node-pool.constants';

export default class FlavorsListController {
  $onInit() {
    this.excludeCategories = EXCLUDE_FLAVOR_CATEGORIES;

    if (!this.defaultFlavor && this.flavors) {
      this.defaultFlavor = find(this.flavors, { name: 'b2-7' });
    }
  }
}
