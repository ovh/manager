export default class IamAdvancedModeSwitchController {
  /* @ngInject */
  constructor(PreferencesService) {
    this.PreferencesService = PreferencesService;
  }

  onChangeMode(modelValue) {
    const promise = modelValue
      ? this.PreferencesService.enableAdvancedMode()
      : this.PreferencesService.disableAdvancedMode();

    promise
      .then(() => this.goTo({ name: '.', reload: true }))
      .catch(({ data: error }) =>
        this.alert.error('iam_advanced_mode_switch_error', {
          message: error?.message,
        }),
      );
  }
}
