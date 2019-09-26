import get from 'lodash/get';

export default class ErrorCtrl {
  /* @ngInject */
  constructor($transition$) {
    this.$transition$ = $transition$;
  }

  $onInit() {
    this.error = get(this.$transition$.params(), 'error');

    if (get(this.error, 'code') === 'LOADING_STATE_ERROR') {
      // remove code to display common message
      this.error.code = null;
    }
  }
}
