export default class {
  $onInit() {
    if (!this.rules) {
      this.goBack();
    }
  }

  primaryAction() {
    this.trackClick(
      'web::hosting::cdn::configure::apply-configuration::confirm',
    );
    this.success();
    return this.goBack();
  }

  secondaryAction() {
    this.trackClick(
      'web::hosting::cdn::configure::apply-configuration::confirm',
    );
  }
}
