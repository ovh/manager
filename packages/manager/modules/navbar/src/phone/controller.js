import get from 'lodash/get';
import { SUPPORT_PHONE } from './constants';

export default class PhoneCtrl {
  $onInit() {
    this.phoneNumber = SUPPORT_PHONE[get(this.user, 'supportLevel.level')];
  }
}
