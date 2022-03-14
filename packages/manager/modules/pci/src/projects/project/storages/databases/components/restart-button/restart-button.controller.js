export default class PciRestartButtonController {
  click($event) {
    if (!this.disabled) {
      $($event.target).addClass('spin');
      this.onClick();
      setTimeout(() => {
        $($event.target).removeClass('spin');
      }, 500);
    }
  }
}
