export default class NashaComponentsTasksPollerController {
  /* @ngInject */
  constructor(NashaTask, Poller) {
    this.NashaTask = NashaTask;
    this.Poller = Poller;
  }

  $onInit() {
    const { namespace, NashaTask, nashaApiUrl, Poller, reload } = this;
    const statuses = Object.values(NashaTask.status);
    let { tasks } = this;

    if (this.operations?.length > 0) {
      tasks = tasks.filter(({ operation }) =>
        this.operations.includes(operation),
      );
    }

    tasks.forEach(({ taskId }) =>
      Poller.poll(`${nashaApiUrl}/task/${taskId}`, null, {
        successRule: ({ status }) => !statuses.includes(status),
        namespace,
      }).then(reload),
    );
  }

  $onDestroy() {
    this.Poller.kill({ namespace: this.namespace });
  }
}
