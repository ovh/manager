import isString from 'lodash/isString';

import { DOCUMENTATION_BY_SUB, STATUS } from './sgx/sgx.constants';

export default class AdvancedFeatures {
  $onInit() {
    this.sgx.menu = {
      documentation: this.buildSgxDocumentation(),
      introduction: !this.sgx.isRunning && this.sgx.status === STATUS.DISABLED,
      manage: !this.sgx.isRunning && this.sgx.status !== STATUS.DISABLED,
    };

    this.sgx.menu.exists =
      this.sgx.menu.documentation.exists ||
      this.sgx.menu.introduction ||
      this.sgx.menu.manage;
  }

  buildSgxDocumentation() {
    const documentationUrl = DOCUMENTATION_BY_SUB[this.user.ovhSubsidiary];

    return {
      exists: isString(documentationUrl),
      url: documentationUrl,
    };
  }
}
