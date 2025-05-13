import find from 'lodash/find';
import get from 'lodash/get';

import { OPTION_TYPES } from '../../option/option.constants';

export default class {
  /* @ngInject */
  constructor($element, $timeout) {
    this.$element = $element;
    this.$timeout = $timeout;

    this.OPTION_TYPES = OPTION_TYPES;
  }

  $postLink() {
    // Sometimes the digest cycle is done before dom manipulation,
    // So we use $timeout to force the $apply
    this.$timeout(() => {
      this.selectedItem = find(this.servicePacks, {
        name: get(this.defaultValue, 'name'),
      });

      if (this.selectedItem) {
        this.handleOnChange();
      }

      this.$element.addClass('d-block');
    });
  }

  handleOnChange() {
    if (this.onChange) {
      this.onChange({ selectedItem: this.selectedItem });
    }
  }
}
