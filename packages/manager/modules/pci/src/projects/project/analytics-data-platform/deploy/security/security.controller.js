import find from 'lodash/find';

import {
  ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO,
} from '../../analytics-data-platform.constants';

export default class {
  /* @ngInject */
  constructor() {
    this.ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO = ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO;
    this.data = {
      selectedSshKey: null,
      masterPassword: '',
      masterPasswordConfirm: '',
    };
  }

  dataChange(masterPassword) {
    this.onDataChange({
      data: {
        masterPassword,
        selectedSshKey: this.data.selectedSshKey,
      },
    });
  }

  /**
   * check if field is required to show on the UI
   *
   * @param {*} fieldName
   * @returns true if the field needs to show on the UI, false otherwise
   */
  isFieldRequired(fieldName) {
    if (this.selectedCapability) {
      const requiredField = find(
        this.selectedCapability.requirements,
        (fieldDefinition) => fieldName === fieldDefinition.fieldName,
      );
      return requiredField && requiredField.display;
    }
    return false;
  }


  /**
   * Checks if the master password and the confirm password matches
   *
   * @returns a boolean indicating whether the passwords match
   */
  checkPasswordLength(password) {
    return password
      && (password.length >= this.ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO.minMasterPasswordLength)
      && (password.length <= this.ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO.maxMasterPasswordLength);
  }
}
