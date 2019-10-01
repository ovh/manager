import first from 'lodash/first';
import includes from 'lodash/includes';

import { KIND, STATUS } from './streams.constants';

export default class Stream {
  constructor(resource) {
    Object.assign(this, resource);
  }

  isInstalling() {
    return includes(STATUS.INSTALLING, this.status);
  }

  isRuning() {
    return includes(STATUS.RUNNING, this.status);
  }

  isError() {
    return includes(STATUS.ERROR, this.status);
  }

  isPersistent() {
    return this.kind === KIND.PERSISTENT;
  }

  isNonPersistent() {
    return this.kind === KIND.NON_PERSISTENT;
  }

  get region() {
    return first(this.regions);
  }

  get streamUrl() {
    return `${this.isPersistent() ? 'persistent' : 'non-persistent'}://${this.id}/${this.name}/${this.name}`;
  }
}
