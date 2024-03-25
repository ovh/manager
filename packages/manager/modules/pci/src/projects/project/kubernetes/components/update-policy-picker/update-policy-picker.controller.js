import { DOCUMENTATION_LINK } from './update-policy-picker.constants';

export default class UpdatePolicyPickerController {
  /* @ngInject */
  constructor(coreConfig) {
    this.documentationLink =
      DOCUMENTATION_LINK[coreConfig.getUser().ovhSubsidiary] ??
      DOCUMENTATION_LINK.DEFAULT;
  }
}
