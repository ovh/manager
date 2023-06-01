export default class IamAdvancedModeSwitchController {
  /* @ngInject */
  constructor(IAMService) {
    this.IAMService = IAMService;
  }

  onChangeMode(modelValue) {
    const promise = modelValue
      ? this.IAMService.enableAdvancedMode()
      : this.IAMService.disableAdvancedMode();

    promise
      .then(() => this.goTo({ name: '.', reload: true }))
      .catch(({ data: error }) =>
        this.alert.error('iam_advanced_mode_switch_error', {
          message: error?.message,
        }),
      );
  }
}
