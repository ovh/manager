import chunk from 'lodash/chunk';
import difference from 'lodash/difference';
import filter from 'lodash/filter';

import template from './telecom-v4-links.html';

export default {
  template,
  bindings: {
    actions: '=telecomV4Links',
  },
  controller() {
    const self = this;

    self.actionRows = {
      main: null,
      normal: null,
    };

    /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

    self.$onInit = () => {
      const mainActions = filter(
        self.actions,
        (action) => action.main && !action.divider,
      );

      self.actionRows.main = chunk(mainActions, 2);

      self.actionRows.normal = chunk(
        filter(
          difference(self.actions, mainActions),
          (action) => !action.divider,
        ),
        3,
      );
    };

    /* -----  End of INITIALIZATION  ------*/
  },
};
