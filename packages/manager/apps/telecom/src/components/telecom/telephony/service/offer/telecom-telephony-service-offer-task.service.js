import isArray from 'lodash/isArray';

angular.module('managerApp').service('voipServiceOfferTask', function ($q, OvhApiTelephony, Poller) {
  const self = this;

  self.getTaskInStatus = function (billingAccount, serviceName, statusParam,
    actionParam, serviceTypeParam) {
    const status = isArray(statusParam) ? statusParam : [statusParam];
    const promises = [];
    let taskIds = [];

    status.forEach((statusVal) => {
      promises.push(OvhApiTelephony.Service().OfferTask().v6().query({
        billingAccount,
        serviceName,
        action: actionParam,
        status: statusVal,
        serviceType: serviceTypeParam,
      }).$promise.then((taskIdsOfStatus) => {
        taskIds = taskIds.concat(taskIdsOfStatus);
      }));
    });

    return $q.allSettled(promises).then(() => {
      if (taskIds.length === 1) {
        return self.getTaskDetails(billingAccount, serviceName, taskIds[0]);
      }

      return $q.when(null);
    });
  };

  self.getTaskDetails = function (billingAccount, serviceName, taskId) {
    return OvhApiTelephony.Service().OfferTask().v6().get({
      billingAccount,
      serviceName,
      taskId,
    }).$promise;
  };

  self.startPolling = function (billingAccount, serviceName, taskId, pollOptions) {
    return Poller.poll(['/telephony', billingAccount, 'service', serviceName, 'offerTask', taskId].join('/'), {
      cache: false,
    }, pollOptions);
  };

  self.stopPolling = function (pollingNamespage) {
    return Poller.kill({
      namespace: pollingNamespage,
    });
  };
});
