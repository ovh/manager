import includes from 'lodash/includes';
import keys from 'lodash/keys';
import values from 'lodash/values';

import { STATUS } from '../sgx.constants';

export default class {
  static isSgxStatusValid(value) {
    const isValueValid = includes(values(STATUS), value);
    const isKeyValid = includes(keys(STATUS), value);

    return isValueValid || isKeyValid;
  }

  static resolveSgxStatus(value) {
    if (includes(values(STATUS), value)) {
      return value;
    }

    return STATUS[value];
  }

  static buildStatusClassName({ isRunning, status }) {
    if (isRunning) {
      return 'oui-badge_warning';
    }

    if (status === STATUS.DISABLED) {
      return 'oui-badge_error';
    }

    return 'oui-badge_success';
  }

  static buildStatusTextId({ isRunning, status }) {
    if (isRunning) {
      return 'dedicated_server_dashboard_advanced_features_sgx_status_isRunning';
    }

    switch (status) {
      case STATUS.DISABLED:
        return 'dedicated_server_dashboard_advanced_features_sgx_status_disabled';

      case STATUS.ENABLED:
        return 'dedicated_server_dashboard_advanced_features_sgx_status_enabled';

      case STATUS.SOFTWARE_CONTROLLED:
        return 'dedicated_server_dashboard_advanced_features_sgx_status_softwareControlled';

      default:
        throw new Error(
          `The input value ${status} should be of type SgxStatus`,
        );
    }
  }
}
