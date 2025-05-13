import pull from 'lodash/pull';

export default class XdslTaskPoller {
  /* @ngInject */
  constructor(OvhApiXdslTasksCurrent) {
    this.OvhApiXdslTasksCurrent = OvhApiXdslTasksCurrent;

    this.handlers = {};
  }

  start(serviceName, scope, successHandler, errorHandler) {
    this.successHandler = successHandler;
    this.errorHandler = errorHandler;
    this.lastResult = null;

    return this.OvhApiXdslTasksCurrent.Aapi()
      .poll(scope, {
        xdslId: serviceName,
      })
      .then(
        (result) => this.handleResult(result),
        (error) => this.errorHandler(error),
        (pending) => this.handleResult(pending),
      );
  }

  handleResult(result) {
    if (result.success) {
      Object.keys(this.handlers).forEach((taskId) => {
        if (
          this.lastResult &&
          this.lastResult[taskId] &&
          !result.data[taskId]
        ) {
          (this.handlers[taskId] || []).forEach((handler) => handler());
        }
      });

      this.lastResult = result.data;
      this.successHandler(result);
    } else {
      this.errorHandler(result);
    }
  }

  register(taskId, handler) {
    this.handlers[taskId] = this.handlers[taskId] || [];
    this.handlers[taskId].push(handler);
    return { taskId, handler };
  }

  unregister(ticket) {
    pull(this.handlers[ticket.taskId], ticket.handler);
  }
}
