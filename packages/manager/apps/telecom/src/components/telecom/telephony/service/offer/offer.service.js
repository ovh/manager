import isArray from 'lodash/isArray';

export default /* @ngInject */ function voipServiceOfferTask(
  $q,
  OvhApiTelephony,
  Poller,
) {
  const self = this;

  self.getTaskInStatus = function getTaskInStatus(
    billingAccount,
    serviceName,
    statusParam,
    actionParam,
    serviceTypeParam,
  ) {
    const status = isArray(statusParam) ? statusParam : [statusParam];
    const promises = [];
    let taskIds = [];

    status.forEach((statusVal) => {
      promises.push(
        OvhApiTelephony.Service()
          .OfferTask()
          .v6()
          .query({
            billingAccount,
            serviceName,
            action: actionParam,
            status: statusVal,
            serviceType: serviceTypeParam,
          })
          .$promise.then((taskIdsOfStatus) => {
            taskIds = taskIds.concat(taskIdsOfStatus);
          }),
      );
    });

    return $q.allSettled(promises).then(() => {
      if (taskIds.length === 1) {
        return self.getTaskDetails(billingAccount, serviceName, taskIds[0]);
      }

      return $q.when(null);
    });
  };

  self.getTaskDetails = function getTaskDetails(
    billingAccount,
    serviceName,
    taskId,
  ) {
    return OvhApiTelephony.Service()
      .OfferTask()
      .v6()
      .get({
        billingAccount,
        serviceName,
        taskId,
      }).$promise;
  };

  self.startPolling = function startPolling(
    billingAccount,
    serviceName,
    taskId,
    pollOptions,
  ) {
    return Poller.poll(
      [
        '/telephony',
        billingAccount,
        'service',
        serviceName,
        'offerTask',
        taskId,
      ].join('/'),
      {
        cache: false,
      },
      pollOptions,
    );
  };

  self.stopPolling = function stopPolling(pollingNamespage) {
    return Poller.kill({
      namespace: pollingNamespage,
    });
  };
}
