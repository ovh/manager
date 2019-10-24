export default class Navigation {
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
    $('.help4wizards').hide();

    this.currentActionData = null;
    this.stepPath = '';
  }
}
