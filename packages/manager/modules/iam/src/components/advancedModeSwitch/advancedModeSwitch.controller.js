import { TAG } from '../../iam.constants';

export default class IamAdvancedModeSwitchController {
  /* @ngInject */
  constructor(IAMService) {
    this.IAMService = IAMService;
  }

  onAdvancedModeChanged(isEnabled) {
    const promise = isEnabled
      ? this.IAMService.enableAdvancedMode()
      : this.IAMService.disableAdvancedMode();

    this.trackClick(
      isEnabled ? TAG.ENABLE_ADVANCED_MODE : TAG.DISABLE_ADVANCED_MODE,
    );

    promise
      .then(() => this.goTo({ name: '.', reload: true }))
      .catch(({ data: error }) =>
        this.alert.error('iam_advanced_mode_switch_error', {
          message: error?.message,
        }),
      );
  }
}
