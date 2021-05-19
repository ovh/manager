import { NOTEBOOK_STATUS } from './Notebook.constants';

export default class Notebook {
  constructor(notebook) {
    Object.assign(this, notebook);
  }

  isStarting() {
    return this.status.state === NOTEBOOK_STATUS.STARTING;
  }

  isRunning() {
    return this.status.state === NOTEBOOK_STATUS.RUNNING;
  }

  isStopped() {
    return this.status.state === NOTEBOOK_STATUS.STOPPED;
  }

  isStopping() {
    return this.status.state === NOTEBOOK_STATUS.STOPPING;
  }

  get name() {
    return this.spec.name;
  }

  get region() {
    return this.spec.region;
  }
}
