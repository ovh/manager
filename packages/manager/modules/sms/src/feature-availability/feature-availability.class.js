import includes from 'lodash/includes';

import {
  SMS_AVAILABILITY,
} from './feature-availability.constants';

export default class SMSFeatureAvailability {
  constructor({ ovhSubsidiary }) {
    this.ovhSubsidiary = ovhSubsidiary;
  }

  isAvailable(feature) {
    return includes(SMS_AVAILABILITY[feature], this.ovhSubsidiary);
  }
}
