import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import nacl from 'tweetnacl-util';
import set from 'lodash/set';
import sha256 from 'fast-sha256';
import find from 'lodash/find';

import { ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO } from '../../analytics-data-platform.constants';

export default class {
  /* @ngInject */
  constructor($timeout) {
    this.$timeout = $timeout;
    this.ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO = ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO;
    this.users = [];
  }

  $onInit() {
    this.credentials = cloneDeep(
      this.ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO.credentials,
    );
    this.setUserList();
    this.credentialsInfo = {
      masterPassword: '',
      generatingPasswords: false,
    };
  }

  generatePassword(salt, password) {
    const derivedKey = sha256.pbkdf2(
      this.constructor.str2uint8(password),
      this.constructor.str2uint8(salt),
      this.ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO.rounds,
      this.ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO.dkLen,
    );
    return nacl
      .encodeBase64(derivedKey)
      .substr(0, this.ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO.passwordLength);
  }

  setUserList() {
    this.users = [];
    this.users.push(find(this.credentials, 'service', 'Ambari'));
  }

  generatePasswords() {
    if (this.form.$invalid) {
      return;
    }
    this.credentialsInfo.generatingPasswords = true;
    this.$timeout(() => {
      forEach(this.credentials, (credential) => {
        set(
          credential,
          'password',
          this.generatePassword(
            `${credential.key}${this.platformDetails.analyticsProjectId}`,
            this.credentialsInfo.masterPassword,
          ),
        );
      });
      this.setUserList();
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
