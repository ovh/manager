angular.module('Module.exchange.services').service(
  'navigation',
  class Navigation {
    setAction(action, data) {
      this.currentAction = action;
      this.currentActionData = data;
      this.stepPath = `${this.currentAction}.html`;

      $('#currentAction').modal({
        keyboard: true,
        backdrop: 'static',
      });
    }

    resetAction() {
      $('#currentAction').modal('hide');
      $('.modal-backdrop').remove();

      this.currentActionData = null;
      this.stepPath = '';
    }
  },
);
