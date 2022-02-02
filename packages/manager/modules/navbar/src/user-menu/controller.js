import capitalize from 'lodash/capitalize';
import truncate from 'lodash/truncate';
import { MAX_NAME_LENGTH } from './constants';

export default class {
  $onInit() {
    const firstName = capitalize(this.user.firstname);
    const lastName = truncate(capitalize(this.user.name), {
      length: MAX_NAME_LENGTH,
    });

    const authMethod = this.user.auth.method;
    const { organisation } = this.user;
    this.menuTitle =
      authMethod === 'provider'
        ? `${organisation}`
        : `${firstName} ${lastName}`;
  }
}
