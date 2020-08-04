import { STATUS } from './cloud-connect.constants';

export default class CloudConnectServiceKey {
  constructor({ id, key, provider, status }) {
    Object.assign(this, {
      id,
      key,
      provider,
      status,
    });
  }

  isActive() {
    return this.status === STATUS.ACTIVE;
  }

  isInProcess() {
    return this.status === STATUS.TO_CHECK || this.status === STATUS.DOING;
  }

  isError() {
    return (
      this.status === STATUS.CANCELLED || this.status === STATUS.TERMINATED
    );
  }
}
