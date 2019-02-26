import set from 'lodash/set';

export default class CuiTabController {
  /* @ngInject */
  constructor($timeout) {
    this.active = false;
    this.isActivating = false;
    this.updateActive = (tabAttr) => {
      this.active = tabAttr.active;
      this.isActivating = tabAttr.isActivating;

      if (tabAttr.isActivating) {
        $timeout(() => {
          set(tabAttr, 'isActivating', false);
          this.updateActive(tabAttr);
        }, 200);
      }
    };
  }
}
