export default class {
  /* @ngInject */
  constructor(OvhApiVrack, Poller) {
    this.OvhApiVrack = OvhApiVrack;
    this.Poller = Poller;
  }

  associateVrack(vrack, project) {
    return this.OvhApiVrack.CloudProject()
      .v6()
      .create(
        {
          serviceName: vrack,
        },
        {
          project,
        },
      )
      .$promise.then(({ data }) =>
        this.pollVrackAssociationTask(vrack, data.id),
      );
  }

  pollVrackAssociationTask(vrack, taskId) {
    return this.Poller.poll(
      `/vrack/${vrack}/task/${taskId}`,
      {},
      {
        method: 'get',
        successRule: {
          status: 'done',
        },
      },
    ).then(
      () => true,
      (error) => {
        if (error.status === 404) {
          return true;
        }

        return Promise.reject(error);
      },
    );
  }
}
