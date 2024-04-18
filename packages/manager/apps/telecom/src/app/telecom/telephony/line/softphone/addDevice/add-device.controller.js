import { FIELD_NAME_REGEX } from './add-device.constants';

export default class SoftphoneAddDeviceController {
  constructor() {
    this.model = { name: null };
    this.FIELD_NAME_REGEX = FIELD_NAME_REGEX;
  }
}
