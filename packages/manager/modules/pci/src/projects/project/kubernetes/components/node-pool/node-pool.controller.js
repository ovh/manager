import find from 'lodash/find';

import {
  EXCLUDE_FLAVOR_CATEGORIES,
  NODE_MIN_COUNT,
  NODE_MAX_COUNT,
} from './node-pool.constants';

export default class FlavorsListController {
  $onInit() {
    this.nodeMinCount = this.nodeMinCount || NODE_MIN_COUNT;
    this.nodeMaxCount = this.nodeMaxCount || NODE_MAX_COUNT;
    this.excludeCategories = EXCLUDE_FLAVOR_CATEGORIES;

    if(!this.defaultFlavor && this.flavors) {
      this.defaultFlavor = find(this.flavors, { name: 'b2-7' });
    }
  }
}
