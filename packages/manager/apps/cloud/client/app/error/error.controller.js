export default class ErrorCtrl {
  /* @ngInject */
  constructor($transition$) {
    this.$transition$ = $transition$;
  }

  $onInit() {
    this.error = _.get(this.$transition$.params(), 'error');

    if (_.get(this.error, 'code') === 'LOADING_STATE_ERROR') {
      // remove code to display common message
      this.error.code = null;
    }
  }
}
