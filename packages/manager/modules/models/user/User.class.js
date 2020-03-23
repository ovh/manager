import map from 'lodash/map';
import some from 'lodash/some';

import Certificate from '../certificate/Certificate.class';

import { AUTORENEW_2016_SUBSIDIARIES } from './user.constants';

export default class User {
  constructor(user, certificates) {
    Object.assign(this, {
      ...user,
      certificates: map(
        certificates,
        (certificate) => new Certificate(certificate),
      ),
    });
  }

  hasAutorenew2016() {
    return AUTORENEW_2016_SUBSIDIARIES.includes(this.ovhSubsidiary);
  }

  get isEnterprise() {
    return some(this.certificates, (certificate) => certificate.isEnterprise());
  }
}
