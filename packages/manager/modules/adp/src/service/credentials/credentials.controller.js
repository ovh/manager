import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import nacl from 'tweetnacl-util';
import set from 'lodash/set';
import sha256 from 'fast-sha256';

export default class {
  /* @ngInject */
  constructor($stateParams, $timeout, adpConstants) {
    this.$timeout = $timeout;
    this.adpConstants = adpConstants;
    this.cloudProjectId = $stateParams.serviceName;
  }

  $onInit() {
    this.credentials = cloneDeep(this.adpConstants.ADP_CREDENTIALS_INFO.credentials);
    this.credentialsInfo = {
      masterPassword: '',
      generatingPasswords: false,
    };
  }

  generatePassword(salt, password) {
    const derivedKey = sha256.pbkdf2(
      this.constructor.str2uint8(password),
      this.constructor.str2uint8(salt),
      this.adpConstants.ADP_CREDENTIALS_INFO.rounds,
      this.adpConstants.ADP_CREDENTIALS_INFO.dkLen,
    );
    return nacl.encodeBase64(derivedKey)
      .substr(0, this.adpConstants.ADP_CREDENTIALS_INFO.passwordLength);
  }

  generatePasswords() {
    if (this.form.$invalid) {
      return;
    }
    this.credentialsInfo.generatingPasswords = true;
    this.$timeout(() => {
      forEach(this.credentials, (credential) => {
        set(credential, 'password', this.generatePassword(
          `${credential.key}${this.cloudProjectId}`,
          this.credentialsInfo.masterPassword,
        ));
      });
      this.credentialsInfo.generatingPasswords = false;
    });
  }

  static str2uint8(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    [...str].forEach((c, i) => {
      bufView[i] = str.charCodeAt(i);
    });
    return bufView;
  }
}
