import 'moment';

import Base from './base.class';

export default class Backup extends Base {
  constructor({ createdAt, id, status, description, size }) {
    super();
    Object.assign(this, {
      createdAt,
      id,
      status,
      description,
      size,
    });
  }

  get expirationDate() {
    return moment(this.createdAt)
      .add(90, 'days')
      .format();
  }
}
