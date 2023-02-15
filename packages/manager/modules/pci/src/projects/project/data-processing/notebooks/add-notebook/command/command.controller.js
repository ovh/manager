export default class CommandCtrl {
  $onInit() {
    if (!this.data) {
      this.goBack(true);
    }
  }

  cancel() {
    return this.goBack();
  }
}
