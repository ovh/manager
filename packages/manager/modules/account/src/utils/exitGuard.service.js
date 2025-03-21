export default class ExitGuardService {
  /* @ngInject */
  constructor($window) {
    this.$window = $window;
  }

  static confirmExit(event) {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.returnValue = true;
  }

  activate() {
    this.$window.addEventListener('beforeunload', ExitGuardService.confirmExit);
  }

  deactivate() {
    this.$window.removeEventListener(
      'beforeunload',
      ExitGuardService.confirmExit,
    );
  }
}
